import prismaClient from '../../prisma'

interface SendOrderRequest {
  order_id: string
}

class SendOrderService {
  async execute({ order_id }: SendOrderRequest) {
    // Verificar se o pedido existe e está no status 'draft'
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
    })

    if (!order) {
      throw new Error('Pedido não encontrado.')
    }

    if (order.status !== 'draft') {
      throw new Error('O pedido não está no status "draft".')
    }

    // Atualizar o status do pedido para 'in_progress'
    const updatedOrder = await prismaClient.order.update({
      where: { id: order_id },
      data: { status: 'in_progress' },
    })

    return updatedOrder
  }
}

export { SendOrderService }