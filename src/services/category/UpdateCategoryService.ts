import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface UpdateCategoryRequest {
  id: string
  name: string
}

class UpdateCategoryService {
  async execute({ id, name }: UpdateCategoryRequest): Promise<AppResponse> {
    if (!id || !name) {
      throw new AppError(
        'É necessario informar um ID e um nome!',
        StatusCodes.BAD_REQUEST
      )
    }

    const category = await prismaClient.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new AppError('Categoria não encontrada!', StatusCodes.NOT_FOUND)
    }

    const existingCategory = await prismaClient.category.findFirst({
      where: {
        name,
        NOT: { id }
      }
    })

    if (existingCategory) {
      throw new AppError(
        'Já existe uma categoria com esse nome!',
        StatusCodes.CONFLICT
      )
    }

    const updatedCategory = await prismaClient.category.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        name: true
      }
    })

    return {
      data: updatedCategory,
      message: 'Categoria atualizada com sucesso!'
    }
  }
}

export { UpdateCategoryService }
