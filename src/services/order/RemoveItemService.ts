import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { SocketEvents } from '../../@types/socket'
import { emitSocketEvent } from '../../utils/socket'

interface ItemRequest {
  item_id: string
}

class RemoveItemService {
  async execute({ item_id }: ItemRequest): Promise<AppResponse> {
    const item = await prismaClient.item.findUnique({
      where: { id: item_id },
      include: { order: true, product: true }
    })

    if (!item) {
      throw new AppError('Item não encontrado.', StatusCodes.NOT_FOUND)
    }

    const order = await prismaClient.order.findUnique({
      where: { id: item.order_id },
      include: { items: { include: { product: true } } }
    })

    if (!order) {
      throw new AppError('Pedido não encontrado.', StatusCodes.NOT_FOUND)
    }

    await prismaClient.item.delete({
      where: { id: item_id }
    })

    const total =
      order.items.reduce((sum, item) => sum + item.total_value, 0) -
      item.total_value

    await prismaClient.order.update({
      where: { id: order.id },
      data: { total }
    })
    emitSocketEvent(SocketEvents.ORDER_CHANGED, { table_id: order.table_id })

    return { message: 'Item removido com sucesso' }
  }
}

export { RemoveItemService }
