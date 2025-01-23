import { Request, Response } from 'express'
import { ListUsersService } from '../../services/user/ListUsersService'

class ListUsersController {
  async handle(req: Request, res: Response) {
    const listUsersService = new ListUsersService()

    try {
      const users = await listUsersService.execute()
      return res.status(200).json(users)
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

export { ListUsersController }
