import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface CategoryRequest {
  category_id: string
}

class RemoveCategoryService {
  async execute({ category_id }: CategoryRequest): Promise<AppResponse> {
    if (!category_id) {
      throw new AppError(
        'É necessario informar um ID!',
        StatusCodes.BAD_REQUEST
      )
    }
    const categoryExists = await prismaClient.category.findFirst({
      where: { id: category_id }
    })

    if (!categoryExists) {
      throw new AppError('Categoria não encontrada', StatusCodes.NOT_FOUND)
    }

    await prismaClient.category.delete({
      where: { id: category_id }
    })

    return { data: undefined, message: 'Categoria removida com sucesso!' }
  }
}

export { RemoveCategoryService }
