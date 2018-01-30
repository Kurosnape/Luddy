import * as express from 'express'
import * as session from 'express-session'
import * as path from 'path'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'

import * as mainController from './controllers/main'
import * as dbController from './controllers/db'

const config = require('../config')

interface Err extends Error {
  status: number
  data?: any
}

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

    // Error Handler, 31557600000
    this.express.use((err: Err, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.message = err.message
      res.locals.error = (req.app.get('env') === 'development') ? err : {}

      res.status(err.status || 500)
      res.json({
        message: err.message,
        data: err.data
      })
      // res.render('error')
    })
  }

  /**
   * Configure Routes
   * 
   * @class Server
   * @method routes
   * @return void
   */
  private routes() {
    const router: express.Router = express.Router()
    
    router.get('/', mainController.index)
    router.get('/db', dbController.index)

    this.express.use(router)
  }
}

const app = Server.bootstrap()

export default app.express
