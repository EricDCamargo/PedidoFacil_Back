import prismaClient from '../../prisma'

class RemoveProductService {
  async execute(product_id: string) {
    const productExists = await prismaClient.product.findFirst({
      where: { id: product_id }
    })

    if (!productExists) {
      throw new Error('Product not found')
    }

    await prismaClient.product.delete({
      where: { id: product_id }
    })

    return { message: 'Product removed successfully' }
  }
}

export { RemoveProductService }
