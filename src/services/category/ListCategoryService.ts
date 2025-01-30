import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

class ListCategoryService {
  async execute(): Promise<AppResponse> {
    const category = await prismaClient.category.findMany({
      select: {
        id: true,
        name: true
      }
    })
    if (!category) {
      throw new AppError('Nenhuma categoria encontrada!', StatusCodes.NOT_FOUND)
    }
    return { data: category, message: 'Lista de categorias!' }
  }
}

export { ListCategoryService }
