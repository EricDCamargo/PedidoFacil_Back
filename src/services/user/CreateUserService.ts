import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { Role } from '../../@types/types'
import { AppResponse } from '../../@types/app.types'

interface UserRequest {
  name: string
  email: string
  password: string
  role?: Role.ADMIN | Role.USER
}

class CreateUserService {
  async execute({
    name,
    email,
    password,
    role
  }: UserRequest): Promise<AppResponse> {
    if (!email || !password || !name) {
      throw new AppError(
        'Nome email e senha são necessarios!',
        StatusCodes.BAD_REQUEST
      )
    }

    const userAlreadyExists = await prismaClient.user.findUnique({
      where: { email: email }
    })

    if (userAlreadyExists) {
      throw new AppError(
        'Email já cadastrado em outro usuario!',
        StatusCodes.CONFLICT
      )
    }

    const passwordHash = await hash(password, 8)

    try {
      const user = await prismaClient.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          role: role || Role.USER
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      })

      return { data: user, message: 'Usuario criado com sucesso!' }
    } catch (error) {
      throw new AppError(
        'Erro ao criar usuario!',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export { CreateUserService }
