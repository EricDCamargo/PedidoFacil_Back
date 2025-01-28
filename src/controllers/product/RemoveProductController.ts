import { Request, Response } from 'express'
import { RemoveProductService } from '../../services/product/RemoveProductService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class RemoveProductController {
  async handle(req: Request, res: Response) {
    const product_id = req.query.product_id as string

    const removeProductService = new RemoveProductService()

    try {
      const result = await removeProductService.execute(product_id)
      return res.status(StatusCodes.OK).json(result)
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

export { RemoveProductController }
