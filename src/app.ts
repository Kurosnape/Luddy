import * as express from 'express'
import * as path from 'path'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'

import * as mainController from './controllers/main'

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
    this.express.set('view engine', 'ejs')

    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use(express.static(path.join(__dirname, 'assets'), { maxAge: 31557600000 }))

    // Error Handler
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

    this.express.use(router)
  }
}

const app = Server.bootstrap()
export default app.express
// module.exports = app.express
