import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface UserRequest {
  user_id: string
}

class RemoveUserService {
  async execute({ user_id }: UserRequest): Promise<AppResponse> {
    if (!user_id) {
      throw new AppError(
        'Necessario informar ID do usuario!',
        StatusCodes.BAD_REQUEST
      )
    }

    const userExists = await prismaClient.user.findFirst({
      where: {
        id: user_id
      }
    })

    if (!userExists) {
      throw new AppError('Usuario não foi encontrado!', StatusCodes.NOT_FOUND)
    }

    await prismaClient.user.delete({
      where: {
        id: user_id
      }
    })

    return { data: undefined, message: 'Usuario removido com sucesso!' }
  }
}

export { RemoveUserService }
