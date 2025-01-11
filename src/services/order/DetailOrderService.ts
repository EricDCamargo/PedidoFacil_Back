import prismaClient from '../../prisma'

interface DetailRequest {
  order_id: string
}

class DetailOrderService {
  async execute({ order_id }: DetailRequest) {
    const order = await prismaClient.order.findUnique({
      where: {
        id: order_id
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        table: true,
        payments: true
      }
    })

    if (!order) {
      throw new Error('Pedido não encontrado.')
    }

    return order
  }
}

export { DetailOrderService }
