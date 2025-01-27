import { OrderStatus } from '../../@types/types'
import prismaClient from '../../prisma'

interface SendOrderRequest {
  order_id: string
}

class SendOrderService {
  async execute({ order_id }: SendOrderRequest) {
    const { DRAFT, IN_PROGRESS } = OrderStatus
    const order = await prismaClient.order.findUnique({
      where: { id: order_id }
    })

    if (!order) {
      throw new Error('Pedido não encontrado.')
    }

    if (order.status !== DRAFT) {
      throw new Error('Pedido já encaminhado para a cozinha.')
    }

    const updatedOrder = await prismaClient.order.update({
      where: { id: order_id },
      data: { status: IN_PROGRESS }
    })

    return updatedOrder
  }
}

export { SendOrderService }
