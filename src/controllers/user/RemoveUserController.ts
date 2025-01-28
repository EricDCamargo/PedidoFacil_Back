import { Request, Response } from 'express'
import { RemoveUserService } from '../../services/user/RemoveUserService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class RemoveUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string

    const removeUser = new RemoveUserService()

    try {
      const result = await removeUser.execute({ user_id })
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }
}

export { RemoveUserController }
