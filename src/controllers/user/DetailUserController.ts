import { Request, Response } from 'express'
import { DetailUserService } from '../../services/user/DetailUserService'

class DetailUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id

    const detailUserService = new DetailUserService()

    try {
      const user = await detailUserService.execute(user_id)
      return res.status(200).json(user)
    } catch (err) {
      if (err.statusCode && err.message) {
        return res.status(err.statusCode).json({ error: err.message })
      }
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
export { DetailUserController }
