import { Request, Response } from 'express'
import { ListByCategoryService } from '../../services/product/ListByCategoryService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ListByCategoryController {
  async handle(req: Request, res: Response) {
    const category_id = req.query.category_id as string

    const listByCategory = new ListByCategoryService()

    try {
      const products = await listByCategory.execute({
        category_id
      })
      return res.status(StatusCodes.OK).json(products)
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
export { ListByCategoryController }
