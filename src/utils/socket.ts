import { io } from '../server'
import { SocketEvents } from '../@types/socket'

export function emitSocketEvent(event: SocketEvents, payload?: any) {
  if (io) {
    io.emit(event, payload)
  }
}
