import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { PrinterService } from '../../services/printer/PrinterService'

class PrinterController {
  async testConection(req: Request, res: Response) {
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
  async printOrderToKitchen(req: Request, res: Response) {
    const order_id = req.query.order_id as string
    const printerService = new PrinterService()

    try {
      const print = await printerService.printKitchenOrder(order_id)

      return res.status(StatusCodes.OK).json(print)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      console.error('Error printing order to kitchen:', error)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }
}

export { PrinterController }
