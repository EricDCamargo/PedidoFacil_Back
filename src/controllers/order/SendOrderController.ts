import { Request, Response } from 'express'
import { SendOrderService } from '../../services/order/SendOrderService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { PrinterService } from '../../services/printer/PrinterService'

class SendOrderController {
  async handle(req: Request, res: Response) {
    const { order_id } = req.body

    const sendOrder = new SendOrderService()
    const printerService = new PrinterService()

    try {
      const order = await sendOrder
        .execute({
          order_id
        })
        .then(() => printerService.printKitchenOrder(order_id))

      return res.status(StatusCodes.OK).json(order)
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

export { SendOrderController }
