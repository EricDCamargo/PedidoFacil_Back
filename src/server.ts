import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import path from 'path'
import { router } from './routes'
import fileUpload from 'express-fileupload'
import { StatusCodes } from 'http-status-codes'
import http from 'http'
import { Server } from 'socket.io'

const app = express()

//Default middlewares
app.use(express.json())
app.use(cors())

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  })
)

app.use(router)
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: err.message
    })
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    messege: 'Internal server error'
  })
})

let io: Server | undefined

if (process.env.USE_SOCKET === 'true') {
  const server = http.createServer(app)
  io = new Server(server)

  io.on('connection', socket => {
    console.log('Novo cliente conectado:', socket.id)
  })

  server.listen(process.env.PORT || 3333, () => {
    console.log('Server online com socket!')
  })
}

export default app
export { io }
