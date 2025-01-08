import { Request, Response } from 'express'
import { UpdateUserService } from '../../services/user/UpdateUserService'

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string
    const { name, email } = req.body

    const updateUserService = new UpdateUserService()

    try {
      const updatedUser = await updateUserService.execute({
        user_id,
        name,
        email
      })
      return res.json(updatedUser)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}

export { UpdateUserController }
