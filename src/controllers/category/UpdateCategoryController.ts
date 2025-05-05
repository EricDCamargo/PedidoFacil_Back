import { Response, Request } from 'express'
import { UpdateCategoryService } from '../../services/category/UpdateCategoryService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class UpdateCategoryController {
  async handle(req: Request, res: Response) {
    const category_id = req.query.category_id as string
    const { name } = req.body
    const updateCategoryService = new UpdateCategoryService()

    try {
      const category = await updateCategoryService.execute({
        id: category_id,
        name: name
      })

      return res.status(StatusCodes.OK).json(category)
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

export { UpdateCategoryController }
