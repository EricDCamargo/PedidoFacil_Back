import { Request, Response, response } from 'express'
import { CreateUserServices } from '../../services/user/CreateUserService'

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, role } = req.body

    const createUserServices = new CreateUserServices()

    try {
      const user = await createUserServices.execute({
        name,
        email,
        password,
        role
      })
      return res.status(201).json(user)
    } catch (err) {
      if (err.statusCode && err.message) {
        return res.status(err.statusCode).json({ error: err.message })
      }
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

export { CreateUserController }
