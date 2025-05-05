import prismaClient from '../../prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'

interface AuthRequest {
  email: string
  password: string
}

class AuthUserService {
  async execute({ email, password }: AuthRequest): Promise<AppResponse> {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    })

    if (!user) {
      throw new AppError(
        'Usuario não encontrado, credenciais incoretas!',
        StatusCodes.BAD_REQUEST
      )
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError('Senha incoreta!', StatusCodes.BAD_REQUEST)
    }

    const token = sign(
      { name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '30d'
      }
    )

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      },
      message: 'Login feito com sucesso!'
    }
  }
}
export { AuthUserService }
