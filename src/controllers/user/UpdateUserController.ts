import { Request, Response } from 'express'
import { UpdateUserService } from '../../services/user/UpdateUserService'

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string
    const { name, email, role } = req.body

    const updateUserService = new UpdateUserService()

    try {
      const updatedUser = await updateUserService.execute({
        user_id,
        name,
        email,
        role
      })
      return res.status(200).json(updatedUser)
    } catch (err) {
      if (err.statusCode && err.message) {
        return res.status(err.statusCode).json({ error: err.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export { UpdateUserController }
