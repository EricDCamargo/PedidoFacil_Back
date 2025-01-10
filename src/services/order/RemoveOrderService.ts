import prismaClient from '../../prisma'

interface OrderRequest {
  order_id: string
}

class RemoveOrderService {
  async execute({ order_id }: OrderRequest) {
    // Verificar se o pedido existe e está no status 'draft'
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
    })

    if (!order) {
      throw new Error('Pedido não encontrado.')
    }

    if (order.status !== 'draft') {
      throw new Error('O pedido não pode ser removido porque não está no status "draft".')
    }

    // Remover o pedido
    const deletedOrder = await prismaClient.order.delete({
      where: {
        id: order_id
      }
    })

    return deletedOrder
  }
}

export { RemoveOrderService }