import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

class DetailUserService {
  async execute(user_id: string): Promise<AppResponse> {
    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })
    if (!user) {
      throw new AppError('Usuario não foi encontrado!', StatusCodes.NOT_FOUND)
    }
    return { data: user, message: 'Usuario ativo!' }
  }
}

export { DetailUserService }
