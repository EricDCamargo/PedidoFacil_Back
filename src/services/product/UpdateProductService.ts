import prismaClient from '../../prisma'

interface UpdateProductRequest {
  product_id: string
  name?: string
  price?: number
  description?: string
  banner?: string
  category_id?: string
}

class UpdateProductService {
  async execute({ product_id, name, price, description, banner, category_id }: UpdateProductRequest) {
    const productExists = await prismaClient.product.findFirst({
      where: { id: product_id },
    })

    if (!productExists) {
      throw new Error('Product not found')
    }

    const updatedProduct = await prismaClient.product.update({
      where: { id: product_id },
      data: {
        name,
        price,
        description,
        banner,
        category_id,
        updated_at: new Date(),
      },
    })

    return updatedProduct
  }
}

export { UpdateProductService }
