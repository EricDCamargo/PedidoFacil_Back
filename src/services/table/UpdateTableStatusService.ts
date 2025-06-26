import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { SocketEvents } from '../../@types/socket'
import { emitSocketEvent } from '../../utils/socket'

interface UpdateTableStatusRequest {
  table_id: string
  status: string
}

class UpdateTableStatusService {
  async execute({
    table_id,
    status
  }: UpdateTableStatusRequest): Promise<AppResponse> {
    const table = await prismaClient.table.findUnique({
      where: { id: table_id }
    })

    if (!table) {
      throw new AppError('Mesa não encontrada.', StatusCodes.NOT_FOUND)
    }

    const updatedTable = await prismaClient.table.update({
      where: { id: table_id },
      data: { status, updated_at: new Date() }
    })
    emitSocketEvent(SocketEvents.TABLE_STATUS_CHANGED)

    return { data: updatedTable, message: 'Mesa editada com sucesso!' }
  }
}

export { UpdateTableStatusService }
