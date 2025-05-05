import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface CategoryRequest {
  name: string
}

class CreateCategoryService {
  async execute({ name }: CategoryRequest): Promise<AppResponse> {
    if (!name) {
      throw new AppError(
        'É necessario informar um nome!',
        StatusCodes.BAD_REQUEST
      )
    }

    const existingCategory = await prismaClient.category.findUnique({
      where: { name }
    })

    if (existingCategory) {
      throw new AppError(
        'Já existe uma categoria com esse nome!',
        StatusCodes.CONFLICT
      )
    }

    const category = await prismaClient.category.create({
      data: {
        name: name
      },
      select: {
        id: true,
        name: true
      }
    })
    return { data: category, message: 'Categoria criada com sucesso!' }
  }
}

export { CreateCategoryService }
