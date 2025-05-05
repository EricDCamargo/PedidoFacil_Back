import { Request, Response } from 'express'
import { ListUsersService } from '../../services/user/ListUsersService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ListUsersController {
  async handle(req: Request, res: Response) {
    const listUsersService = new ListUsersService()

    try {
      const users = await listUsersService.execute()
      return res.status(StatusCodes.OK).json(users)
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

export { ListUsersController }
