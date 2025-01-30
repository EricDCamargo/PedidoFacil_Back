import { Response, Request } from 'express'
import { ListCategoryService } from '../../services/category/ListCategoryService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ListCategoryController {
  async handle(req: Request, res: Response) {
    const listCategoryService = new ListCategoryService()
    
    try {
      const category = await listCategoryService.execute()
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

export { ListCategoryController }
