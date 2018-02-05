import { createServer, Server } from 'http'

import * as express from 'express'
import * as session from 'express-session'
import * as flash from 'express-flash'
import * as path from 'path'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as mongo from 'connect-mongo'
import * as mongoose from 'mongoose'
import * as lusca from 'lusca'
import * as dotenv from 'dotenv'
import * as socketIO from 'socket.io'
import * as bluebird from 'bluebird'

import * as passport from 'passport'
import * as naverStrategy from 'passport-naver'
import * as kakaoStrategy from 'passport-kakao'
import * as facebookStrategy from 'passport-facebook'
import * as twitterStrategy from 'passport-twitter'

import * as mainController from './controllers/main'
import * as adminController from './controllers/admin'
import * as userController from './controllers/user'
import * as chatController from './controllers/chat'

import { default as Validator } from './shards/App'
import { default as User } from './models/User'
import { IError } from './shards/Error'

const config = require('../config')
const locale = require('../locales')
dotenv.config({ path: '.env' })

// Connect to MongoDB
const MongoStore = mongo(session)

/**
 * Express Server
 * 
 * @class Server
 */
class App {
  public static readonly PORT: number | string | boolean = Validator.normalizePort(config.port || process.env.PORT)
  private express: express.Application
  private server: Server
  private io: SocketIO.Server
  private port: number | string | boolean
  private mongo: string = config.mongoUrl

  /**
   * Construct Express.js & Socket.io Server
   * 
   * @class Server
   * @constructor
   */
  constructor() {
    this.createApplication()
    this.config()
    this.sockets()
    this.listen()
    this.routes()
    this.errorHandler()
    this.mountDB()

    passport.serializeUser<any, any>((user, done) => {
      done(null, user)
    })

    passport.deserializeUser((user, done) => {
      done(null, user)
    })

    if (config.passport.naver.enable) {
      passport.use('naver-login', new naverStrategy.Strategy({
        clientID: config.passport.naver.clientId,
        clientSecret: config.passport.naver.clientSecret,
        callbackURL: config.passport.naver.callbackUrl
      }, (accessToken, refreshToken, profile, done) => done(null, profile)))
    }
  }
  
  /**
   * Bootstrap the Express application
   * 
   * @class Server
   * @method bootstrap
   * @static
   * @return {Object}
   */
  public static bootstrap(): App {
    return new App()
  }

  private isAuthenticated: express.Handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) {
      return next()
    }

    res.redirect('/login')
  }

  private createApplication(): void {
    this.express = express()

    if (config.debug) {
      this.express.set('env', 'development')
    }

    this.server = createServer(this.express)
  }

  private sockets(): void {
    this.io = socketIO(this.server)
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(locale['Application is running on http://localhost:%d\nPress CTRL-C to stop application.\n'], this.port)
    })
    this.server.on('error', (e: NodeJS.ErrnoException): void => {
      if (e.syscall !== 'listen') {
        throw e
      }

      let bind = (typeof this.port === 'string')
                ? `Pipe ${this.port}`
                : `Port ${this.port}`
      
      // Handle specific listen errors with friendly messages
      switch (e.code) {
        case 'EACCES':
          console.error(locale['Permission denied'])
          process.exit(1)
          break
        case 'EADDRINUSE':
          console.error(locale['%s already in use'], bind)
          process.exit(1)
          break
        default:
          throw e
      }
    })

    this.io.on('connect', (socket: any) => {
      console.log('Connected client on port %s', this.port)
      socket.emit('toClient', { msg: 'Successfully Established' })
      socket.on('fromClient', (data: any) => {
        socket.broadcast.emit('toClient', data)
        socket.emit('toClient', data)
        console.log(`Message from ${data.msg}`)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }

  /**
   * Configure application
   * 
   * @class Server
   * @method config
   * @return void
   */
  private config(): void {
    this.port = App.PORT

    // this.express.enable('view cache')
    this.express.disable('x-powered-by')
    this.express.set('views', path.join(__dirname, '../views'))
    this.express.set('view engine', 'hbs')

    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))

    // Link dist folder to assets<main> and Allow to access assets
    this.express.use('/assets', express.static(path.join(__dirname, '../assets/dist'), { maxAge: config.assets_maxAge })) // 2.5 hours
    this.express.use('/assets', express.static(path.join(__dirname, '../assets/static'), { maxAge: config.assets_maxAge })) // 2.5 hours

    // Sesstion Handler
    this.express.use(session({
      secret: config.handle_hash,
      saveUninitialized: true,
      resave: true,
      store: new MongoStore({
        url: this.mongo,
        autoReconnect: true
      })
    }))

    // Passport Default Setting
    this.express.use(passport.initialize())
    this.express.use(passport.session())
    this.express.use(flash())
    this.express.use(lusca.xframe('SAMEORIGIN'))
    this.express.use(lusca.xssProtection(true))
  }

  /**
   * Configure Routes
   * 
   * @class Server
   * @method routes
   */
  private routes(): void {
    const router: express.Router = express.Router()
    
    router.get('/', this.isAuthenticated, mainController.index)
    router.get('/login', userController.login)
    router.get('/logout', userController.logout)
    router.get('/chat', chatController.index)
    router.get('/admin', adminController.index)

    if (config.passport.naver.enable) {
      router.get('/login/naver', passport.authenticate('naver-login'))
      router.get(config.passport.naver.callbackUrl, passport.authenticate('naver-login', {
        successRedirect: '/',
        failureRedirect: '/login?t=loginFailure&s=naver'
      }))
    }

    this.express.use(router)
  }

  /**
   * Display error page
   */
  private errorHandler(): void {
    this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const err: any = new Error('Not Found')
      err.status = 404
      next('err')
    })

    this.express.use((err: IError, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.message = err.message
      res.locals.error = (config.debug) ? err : {}

      res.status(err.status || 500)
      res.render('error', {
        layout: false,
        title: 'Not Found',
        message: err.message,
        data: err.data
      })
    })
  }

  private mountDB(): void {
    (<any>mongoose).Promise = bluebird
    mongoose.connect(this.mongo).then(
      () => { /* Ready to use */ }
    ).catch(err => {
      console.log(`MongoDB connection error. Please make sure MongoDB is running: ${err}`)
    })
  }
}

const app = App.bootstrap()
export default app
