import * as express from 'express'
import * as session from 'express-session'
import * as path from 'path'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'

import * as passport from 'passport'
import * as kakaoStrategy from 'passport-kakao'

import * as mainController from './controllers/main'
import * as userController from './controllers/user'
import * as dbController from './controllers/db'
import * as chatController from './controllers/chat'

import { IError } from './shards/Error'

const config = require('../config')

/**
 * Express Server
 * 
 * @class Server
 */
class Server {
  public express: express.Application

  /**
   * Construct Express.js & Socket.io Server
   * 
   * @class Server
   * @constructor
   */
  constructor() {
    this.express = express()

    this.config()
    this.routes()

    passport.serializeUser((user, done) => {
      done(null, user)
    })

    passport.deserializeUser((user, done) => {
      done(null, user)
    })

    passport.use('kakao-login', new kakaoStrategy.Strategy({
      clientID: config.passport.kakao.clientId,
      clientSecret: config.passport.kakao.clientSecret,
      callbackURL: config.passport.kakao.callbackUrl
    }, (accessToken, refreshToken, profile, done) => {
      console.log('액세스토른 : ', accessToken, '새 토큰 : ', refreshToken, '프로파일 : ', profile)
      return done(null, profile)
    }))
  }

  /**
   * Bootstrap the Express application
   * 
   * @class Server
   * @method bootstrap
   * @static
   * @return {Object}
   */
  public static bootstrap(): Server {
    return new Server()
  }

  /**
   * Configure application
   * 
   * @class Server
   * @method config
   * @return void
   */
  private config() {
    this.express.set('views', path.join(__dirname, '../views'))
    this.express.set('view engine', 'pug')

    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))

    // Link dist folder to assets<main> and Allow to access assets
    this.express.use('/assets', express.static(path.join(__dirname, '../assets/dist'), { maxAge: config.assets_maxAge })) // 2.5 hours

    // Sesstion Handler
    this.express.use(session({
      secret: config.handle_hash,
      resave: true,
      saveUninitialized: true
    }))

    // Passport Default Setting
    this.express.use(passport.initialize())
    this.express.use(passport.session())

    // Error Handler, 31557600000
    this.express.use((err: IError, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.message = err.message
      res.locals.error = (config.debug) ? err : {}

      res.status(err.status || 500)
      res.render('error', {
        message: err.message,
        data: err.data
      })
    })
  }

  /**
   * Configure Routes
   * 
   * @class Server
   * @method routes
   */
  private routes() {
    const router: express.Router = express.Router()
    
    router.get('/', mainController.index)
    router.get('/login', userController.index)
    router.get('/login/kakao', passport.authenticate('kakao-login'))
    router.get('/db', dbController.index)
    router.get('/chat', chatController.index)

    router.get('/oauth/kakao/callback', passport.authenticate('kakao-login', {
      successRedirect: '/',
      failureRedirect: '/'
    }))

    this.express.use(router)
  }
}

const app = Server.bootstrap()

export default app.express
