import { Request, Response } from 'express'
import { PartialPaymentOrderService } from '../../services/payment/PartialPaymentOrderRequest'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class PartialPaymentOrderController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { order_id, payment_method, value } = req.body

    const partialPaymentOrderService = new PartialPaymentOrderService()

    try {
      const result = await partialPaymentOrderService.execute({
        order_id,
        payment_method,
        value: parseFloat(value)
      })

      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error'
      })
    }
  }
}

export { PartialPaymentOrderController }
