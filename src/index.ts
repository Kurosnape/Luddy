import app from './app'
import * as http from 'http'
import * as socket from 'socket.io'

const config = require('../config')
const locale = require(`../locales`)

// Override enviroment
if (config.debug) {
  app.set('env', 'development')
}

// Get port from enviroment and Store in Express
const port = normalizePort(`${config.port}` || `${process.env.PORT}`)
app.set('port', port)

// Create server and listen on provided port (on all network interfaces)
const server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// Attach Socket.io Server
const io = socket.listen(server)
io.sockets.on('connection', (socket) => {
  socket.emit('toClient', { msg: 'Successfully Established' })
  socket.on('fromClient', (data) => {
    socket.broadcast.emit('toClient', data) // Send other clients a message expect self
    socket.emit('toClient', data)
    console.log(`Message from ${data.msg}`)
  })
})

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
      console.error(locale['%s already in use'], bind)
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

  console.log(locale['Application is running on http://localhost:%d with %s Mode\nPress CTRL-C to stop application.\n'], bind, mode)
}
