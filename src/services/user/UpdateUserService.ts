import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { Role } from '../../@types/types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface UpdateUserRequest {
  user_id: string
  name: string
  email: string
  role: Role
}

class UpdateUserService {
  async execute({
    user_id,
    name,
    email,
    role
  }: UpdateUserRequest): Promise<AppResponse> {
    const user = await prismaClient.user.findFirst({
      where: { id: user_id }
    })
    if (!email) {
      throw new AppError(
        'Informar um email e nome validos!',
        StatusCodes.BAD_REQUEST
      )
    }

    if (!user) {
      throw new AppError('Usuario não encontrado!', StatusCodes.NOT_FOUND)
    }
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email,
        NOT: {
          id: user_id
        }
      }
    })

    if (userAlreadyExists) {
      throw new AppError(
        'Email já cadastrado em outro usuario!',
        StatusCodes.CONFLICT
      )
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: user_id },
      data: {
        name,
        email,
        role,
        updated_at: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return { data: updatedUser, message: 'Usuario editado com sucesso!' }
  }
}

export { UpdateUserService }
