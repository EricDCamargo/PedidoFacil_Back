import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

class RemoveProductService {
  async execute(product_id: string): Promise<AppResponse> {
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
      throw new AppError('Produto não encontrado', StatusCodes.NOT_FOUND)
    }

    await prismaClient.item.deleteMany({
      where: { product_id: product_id }
    })

    await prismaClient.product.delete({
      where: { id: product_id }
    })

    return { data: undefined, message: 'Produto removido!' }
  }
}

export { RemoveProductService }
