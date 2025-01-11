import prismaClient from '../../prisma'

interface ItemRequest {
  item_id: string
}

class RemoveItemService {
  async execute({ item_id }: ItemRequest) {
    const item = await prismaClient.item.findUnique({
      where: { id: item_id },
      include: { order: true, product: true }
    })

    if (!item) {
      throw new Error('Item não encontrado.')
    }

    await prismaClient.item.delete({
      where: { id: item_id }
    })

    const order = await prismaClient.order.findUnique({
      where: { id: item.order_id },
      include: { items: { include: { product: true } } }
    })

    if (!order) {
      throw new Error('Pedido não encontrado.')
    }

    const total = order.items.reduce(
      (sum, item) => sum + item.amount * item.product.price,
      0
    )

    await prismaClient.order.update({
      where: { id: order.id },
      data: { total }
    })

    return { message: 'Item removido com sucesso' }
  }
}

export { RemoveItemService }
