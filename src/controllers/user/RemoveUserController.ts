import { Request, Response } from 'express'
import { RemoveUserService } from '../../services/user/RemoveUserService'

class RemoveUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string

    const removeUser = new RemoveUserService()

    try {
      const result = await removeUser.execute({ user_id })
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}

export { RemoveUserController }
