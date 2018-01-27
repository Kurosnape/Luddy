import app from './app'
import * as http from 'http'

const config = require('../config')
const locale = require(`../locales/${config.locale}.json`)
// const debug = require('debug')('luddy:server')

// Get port from enviroment and Store in Express
const port = normalizePort(`${config.port}` || `${process.env.PORT}`)
app.set('port', port)

// Create server and listen on provided port (on all network interfaces)
const server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize port into a number, string, or false
 * 
 * @method normalizePort
 * @param {val} port
 * @returns number | string | boolean
 */
function normalizePort(val: number | string): number | string | boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val

  if (isNaN(port)) {
    return val
  } else if (port >= 0) {
    return port
  } else {
    return false
  }
}

/**
 * Event listener for HTTP server error event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error
  }
  
  let bind = (typeof port === 'string')
          ? `Pipe ${port}`
          : `Port ${port}`
  
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(locale['Permission denied'])
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(locale['Port %s already in use'], bind)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  // TSLint throw an error "Expression is always false"
  /*
  let addr = server.address()
  let bind = (typeof addr === 'string')
           ? `Pipe ${addr}`
           : `Port ${addr.port}`
  */
  const bind = app.get('port')
  const mode = (app.get('env') === 'development') ? locale['Development'] : locale['Production']

  console.log(locale['App is running at http://localhost:%d in %s mode'], bind, mode)
  console.log(locale['Press CTRL-C to stop\n'])
}
