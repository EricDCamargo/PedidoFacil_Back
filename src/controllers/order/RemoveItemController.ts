import { Request, Response } from 'express'
import { RemoveItemService } from '../../services/order/RemoveItemService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class RemoveItemController {
  async handle(req: Request, res: Response) {
    const item_id = req.query.item_id as string

    const removeItem = new RemoveItemService()

    try {
      const item = await removeItem.execute({
        item_id
      })

      return res.status(StatusCodes.OK).json(item)
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

export { RemoveItemController }
