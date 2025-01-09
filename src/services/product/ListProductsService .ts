import prismaClient from '../../prisma'

class ListProductsService {
  async execute() {
    const products = await prismaClient.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return products
  }
}

export { ListProductsService }
