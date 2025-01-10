import prismaClient from '../../prisma'

interface ItemRequest {
  order_id: string
  product_id: string
  amount: number
}

class AddItemService {
  async execute({ order_id, product_id, amount }: ItemRequest) {
    // Verificar se o produto existe
    const product = await prismaClient.product.findUnique({
      where: { id: product_id }
    })


    if (!product) {
      throw new Error('Produto não encontrado.')
    }

    // Adicionar o item ao pedido
    const item = await prismaClient.item.create({
      data: {
        order_id,
        product_id,
        amount
      }
    })

    // Recalcular o total do pedido
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { items: true }
    })

    if (!order) {
      throw new Error('Pedido não encontrado.')
    }

    const total = order.items.reduce(
      (sum, item) => sum + item.amount * product.price,
      0
    )

    await prismaClient.order.update({
      where: { id: order_id },
      data: { total }
    })

    return item
  }
}

export { AddItemService }
