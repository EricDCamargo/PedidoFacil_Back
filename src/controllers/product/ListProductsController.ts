import { Request, Response } from 'express'
import { ListProductsService } from '../../services/product/ListProductsService '
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ListProductsController {
  async handle(req: Request, res: Response) {
    const listProductsService = new ListProductsService()

    try {
      const products = await listProductsService.execute()
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

export { ListProductsController }
