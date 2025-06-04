import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { OrderStatus, TableStatus } from '../../@types/types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { SocketEvents } from '../../@types/socket'
import { io } from '../../server'
import { Order } from '@prisma/client'

interface OrderRequest {
  table_id: string
  name?: string
}

class CreateOrderService {
  async execute({ table_id, name }: OrderRequest): Promise<AppResponse> {
    const { DRAFT, IN_PROGRESS } = OrderStatus
    const { OCCUPIED } = TableStatus

    const table = await prismaClient.table.findUnique({
      where: { id: table_id }
    })

    if (!table) {
      throw new AppError('Mesa não encontrada.', StatusCodes.NOT_FOUND)
    }

    const existingOrders = await prismaClient.order.findMany({
      where: {
        table_id,
        status: {
          in: [DRAFT, IN_PROGRESS]
        }
      }
    })

    if (existingOrders.length === 0) {
      await prismaClient.table
        .update({
          where: { id: table_id },
          data: { status: OCCUPIED }
        })
        .then(() => io.emit(SocketEvents.TABLE_STATUS_CHANGED))
    }
    const order = await prismaClient.order.create({
      data: {
        table: { connect: { id: table_id } },
        name,
        status: DRAFT
      }
    })
    await io.emit(SocketEvents.ORDER_CHANGED, { table_id })

    return { data: order, message: 'Pedido criado!' }
  }
}

export { CreateOrderService }
