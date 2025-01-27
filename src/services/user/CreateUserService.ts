import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { Role } from '../../@types/types'

interface UserRequest {
  name: string
  email: string
  password: string
  role?: Role.ADMIN | Role.USER
}

class CreateUserService {
  async execute({ name, email, password, role }: UserRequest) {
    if (!email || !password || !name) {
      throw new AppError(
        'Name, email, and password are required',
        StatusCodes.BAD_REQUEST
      )
    }

    const userAlreadyExists = await prismaClient.user.findUnique({
      where: { email: email }
    })

    if (userAlreadyExists) {
      throw new AppError('User already exists', StatusCodes.CONFLICT)
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

      return user
    } catch (error) {
      throw new AppError(
        'Error creating user',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export { CreateUserService }
