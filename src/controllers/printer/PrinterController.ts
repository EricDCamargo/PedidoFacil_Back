import { Request, Response } from 'express'
import { SendOrderService } from '../../services/order/SendOrderService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { PrinterService } from '../../services/printer/PrinterService'

class TestPrinterConectionController {
  async handle(req: Request, res: Response) {
    const printerService = new PrinterService()

    try {
      const print = await printerService.testPrinterConnection()

      return res.status(StatusCodes.OK).json(print)
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

export { TestPrinterConectionController }
