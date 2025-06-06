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
      const orderResponse = await sendOrder.execute({ order_id })

      try {
        await printerService.printKitchenOrder(order_id)
      } catch (err) {
        const printError =
          err instanceof AppError
            ? err.message
            : 'Erro inesperado durante execução do serviço de impressão.'

        orderResponse.message = orderResponse.message
          ? `${orderResponse.message} (Observação: ${printError})`
          : `Observação: ${printError}`
      }

      return res.status(StatusCodes.OK).json(orderResponse)
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
