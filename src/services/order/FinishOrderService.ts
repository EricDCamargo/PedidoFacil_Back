import prismaClient from '../../prisma'

interface OrderRequest {
  order_id: string
}

class FinishOrderService {
  async execute({ order_id }: OrderRequest) {
    const order = await prismaClient.order.findUnique({
      where: { id: order_id }
    })

    if (!order) {
      throw new Error('Pedido não encontrado.')
    }

    if (order.status !== 'in_progress') {
      throw new Error('O pedido não está no status "in_progress".')
    }

    // Atualizar o status do pedido para 'completed'
    const updatedOrder = await prismaClient.order.update({
      where: { id: order_id },
      data: {
        status: 'completed'
      }
    })

    return updatedOrder
  }
}

export { FinishOrderService }
