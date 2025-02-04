import { Response, Request } from 'express'
import { CreateCategoryService } from '../../services/category/CreateCategoryService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    const { name } = req.body
    const createCategoryService = new CreateCategoryService()

    try {
      const category = await createCategoryService.execute({
        name: name
      })

      return res.status(StatusCodes.CREATED).json(category)
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

export { CreateCategoryController }
