import { OrderStatus } from '../../@types/types'
import prismaClient from '../../prisma'

interface OrderRequest {
  order_id: string
}

class RemoveOrderService {
  async execute({ order_id }: OrderRequest) {
    const { completed } = OrderStatus
    const order = await prismaClient.order.findUnique({
      where: { id: order_id }
    })

    if (!order) {
      throw new Error('Pedido não encontrado.')
    }

    if (order.status == completed) {
      throw new Error('O pedido não pode ser removido pois já foi entregue".')
    }

    const deletedOrder = await prismaClient.order.delete({
      where: {
        id: order_id
      }
    })

    return deletedOrder
  }
}

export { RemoveOrderService }
