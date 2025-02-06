import { Request, Response } from 'express'
import { DeletePaymentOrderService } from '../../services/payment/DeletePaymentOrderService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class DeletePaymentOrderController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { order_id } = req.body

    const deletePaymentOrderService = new DeletePaymentOrderService()

    try {
      const result = await deletePaymentOrderService.execute({ order_id })
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
