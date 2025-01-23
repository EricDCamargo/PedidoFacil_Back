import { Request, Response } from 'express'
import { RemoveUserService } from '../../services/user/RemoveUserService'

class RemoveUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string

    const removeUser = new RemoveUserService()

    try {
      const result = await removeUser.execute({ user_id })
      return res.status(200).json(result)
    } catch (err) {
      if (err.statusCode && err.message) {
        return res.status(err.statusCode).json({ error: err.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export { RemoveUserController }
