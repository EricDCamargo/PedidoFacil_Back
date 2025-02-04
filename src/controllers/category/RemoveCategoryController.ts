import { Request, Response } from 'express'
import { RemoveCategoryService } from '../../services/category/RemoveCategoryService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class RemoveCategoryController {
  async handle(req: Request, res: Response) {
    const category_id = req.query.category_id as string

    const removeCategoryService = new RemoveCategoryService()

    try {
      const result = await removeCategoryService.execute({ category_id })
      return res.status(StatusCodes.NO_CONTENT).json(result)
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

export { RemoveCategoryController }
