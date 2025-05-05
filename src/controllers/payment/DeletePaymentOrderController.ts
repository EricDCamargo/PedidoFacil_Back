import { Request, Response } from 'express'
import { DeletePaymentOrderService } from '../../services/payment/DeletePaymentOrderService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class DeletePaymentOrderController {
  async handle(req: Request, res: Response): Promise<Response> {
    const payment_id = req.query.payment_id as string

    const deletePaymentOrderService = new DeletePaymentOrderService()

    try {
      const result = await deletePaymentOrderService.execute({ payment_id })
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error'
      })
    }
  }
}

export { DeletePaymentOrderController }
