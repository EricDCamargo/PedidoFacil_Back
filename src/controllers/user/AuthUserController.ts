import { Request, Response } from 'express'
import { AuthUserService } from '../../services/user/AuthUserService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class AuthUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body

    const authUserService = new AuthUserService()

    try {
      const auth = await authUserService.execute({
        email,
        password
      })
      return res.status(StatusCodes.OK).json(auth)
    } catch (error) {
      console.error('Erro ao autenticar:', error)
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }
}
export { AuthUserController }
