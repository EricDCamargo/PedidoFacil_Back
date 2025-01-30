import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
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
  async execute({
    product_id,
    name,
    price,
    description,
    banner,
    category_id
  }: UpdateProductRequest): Promise<AppResponse> {
    if (!product_id) {
      throw new AppError(
        'Necessario informar ID do produto!',
        StatusCodes.BAD_REQUEST
      )
    }
    const productExists = await prismaClient.product.findFirst({
      where: { id: product_id }
    })

    if (!productExists) {
      throw new AppError('Produto não encontrado!', StatusCodes.NOT_FOUND)
    }
    if (typeof price !== 'number') {
      throw new AppError(
        'Price must be provided as a number',
        StatusCodes.BAD_REQUEST
      )
    }

    const updatedProduct = await prismaClient.product.update({
      where: { id: product_id },
      data: {
        name,
        price,
        description,
        banner,
        category_id,
        updated_at: new Date()
      }
    })

    return { data: updatedProduct, message: 'Produto editado com sucesso!' }
  }
}

export { UpdateProductService }
