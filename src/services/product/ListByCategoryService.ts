import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface ProductRequest {
  category_id: string
}

class ListByCategoryService {
  async execute({ category_id }: ProductRequest): Promise<AppResponse> {
    if (!category_id) {
      throw new AppError(
        'Necessario informar ID da categoria!',
        StatusCodes.BAD_REQUEST
      )
    }
    const findByCategory = await prismaClient.product.findMany({
      where: {
        category_id: category_id
      }
    })
    if (!findByCategory) {
      throw new AppError('Nenhum produto encontrado!', StatusCodes.NOT_FOUND)
    }
    return { data: findByCategory, message: 'Lista de protutos por categoria!' }
  }
}

export { ListByCategoryService }
