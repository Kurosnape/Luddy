import * as express from 'express'
import * as session from 'express-session'
import * as flash from 'express-flash'
import * as path from 'path'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as lusca from 'lusca'
import * as dotenv from 'dotenv'

import * as passport from 'passport'
import * as naverStrategy from 'passport-naver'
import * as kakaoStrategy from 'passport-kakao'
import * as facebookStrategy from 'passport-facebook'
import * as twitterStrategy from 'passport-twitter'

import * as mainController from './controllers/main'
import * as userController from './controllers/user'
import * as chatController from './controllers/chat'

import { default as User } from './models/User'
import { IError } from './shards/Error'

const config = require('../config')
dotenv.config({ path: '.env' })

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
  
    if (config.passport.kakao.enable) {
      passport.use('kakao-login', new kakaoStrategy.Strategy({
        clientID: config.passport.kakao.clientId,
        clientSecret: config.passport.kakao.clientSecret,
        callbackURL: config.passport.kakao.callbackUrl
      }, (accessToken, refreshToken, profile, done) => done(null, profile)))
    }

    if (config.passport.facebook.enable) {
      passport.use('facebook-login', new facebookStrategy.Strategy({
        clientID: config.passport.facebook.clientId,
        clientSecret: config.passport.facebook.clientSecret,
        callbackURL: config.passport.facebook.callbackUrl
      }, (accessToken, refreshToken, profile, done) => done(null, profile)))
    }

    if (config.passport.twitter.enable) {
      passport.use('twitter-login', new twitterStrategy.Strategy({
        consumerKey: config.passport.twitter.consumerKey,
        consumerSecret: config.passport.twitter.consumerSecret,
        callbackURL: config.passport.twitter.callbackUrl
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
  public static bootstrap(): Server {
    return new Server()
  }
  
  /**
   * Check the client is authenticated
   * 
   * @return {void}
   */
  public isAuthenticated: express.Handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) {
      return next()
    }

    res.redirect('/login')
  }

  /**
   * Configure application
   * 
   * @class Server
   * @method config
   * @return void
   */
  private config() {
    // this.express.enable('view cache')
    this.express.disable('x-powered-by')
    this.express.set('views', path.join(__dirname, '../views'))
    this.express.set('view engine', 'hbs')

    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))

    // Link dist folder to assets<main> and Allow to access assets
    this.express.use('/assets', express.static(path.join(__dirname, '../assets/dist'), { maxAge: config.assets_maxAge })) // 2.5 hours

    // Sesstion Handler
    this.express.use(session({
      secret: config.handle_hash,
      saveUninitialized: true,
      resave: true
    }))

    // Passport Default Setting
    this.express.use(passport.initialize())
    this.express.use(passport.session())
    this.express.use(flash())
    this.express.use(lusca.xframe('SAMEORIGIN'))
    this.express.use(lusca.xssProtection(true))

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
    
    router.get('/', this.isAuthenticated, mainController.index)
    router.get('/login', userController.login)
    router.get('/logout', userController.logout)
    router.get('/chat', chatController.index)

    if (config.passport.naver.enable) {
      router.get('/login/naver', passport.authenticate('naver-login'))
      router.get(config.passport.naver.callbackUrl, passport.authenticate('naver-login', {
        successRedirect: '/',
        failureRedirect: '/login?t=loginFailure&s=naver'
      }))
    }

    if (config.passport.kakao.enable) {
      router.get('/login/kakao', passport.authenticate('kakao-login'))
      router.get(config.passport.kakao.callbackUrl, passport.authenticate('kakao-login', {
        successRedirect: '/',
        failureRedirect: '/login?t=loginFailure&s=kakao'
      }))
    }

    if (config.passport.facebook.enable) {
      router.get('/login/facebook', passport.authenticate('facebook-login'))
      router.get(config.passport.facebook.callbackUrl, passport.authenticate('facebook-login', {
        successRedirect: '/',
        failureRedirect: '/login?t=loginFailure&s=facebook'
      }))
    }

    if (config.passport.twitter.enable) {
      router.get('/login/twitter', passport.authenticate('twitter-login'))
      router.get(config.passport.twitter.callbackUrl, passport.authenticate('twitter-login', {
        successRedirect: '/',
        failureRedirect: '/login?t=loginFailure&s=twitter'
      }))
    }

    this.express.use(router)
  }
}

const app = Server.bootstrap()

export default app.express
