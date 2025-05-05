import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

class ListProductsService {
  async execute(): Promise<AppResponse> {
    const products = await prismaClient.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    if (!products) {
      throw new AppError('Nenhum produto encontrado!', StatusCodes.NOT_FOUND)
    }

    return { data: products, message: 'Lista de produtos!' }
  }
}

export { ListProductsService }
