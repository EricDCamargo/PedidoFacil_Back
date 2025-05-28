import { Request, Response } from 'express'
import { CloseTableService } from '../../services/table/CloseTableService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { OrderStatus } from '../../@types/types'
import { PrinterService } from '../../services/printer/PrinterService'

class CloseTableController {
  async handle(req: Request, res: Response) {
    const table_id = req.query.table_id as string

    const closeTableService = new CloseTableService()
    const printerService = new PrinterService()

    try {
      // Buscar pedidos com status em aberto, se tiver algum não é possível fechar a mesa
      const hasOpenOrders = await prismaClient.order.findFirst({
        where: {
          table_id,
          status: {
            in: [
              OrderStatus.DRAFT,
              OrderStatus.IN_PROGRESS,
              OrderStatus.COMPLETED
            ]
          }
        }
      })

      if (hasOpenOrders) {
        throw new AppError(
          'Não é possível fechar a mesa: existem pedidos em aberto!',
          StatusCodes.BAD_REQUEST
        )
      }

      const paidOrders = await prismaClient.order.findMany({
        where: {
          table_id,
          status: 'PAID'
        },
        include: {
          items: { include: { product: true } }
        }
      })

      const result = await closeTableService
        .execute({
          table_id
        })
        .then(() => printerService.printPaidOrders(paidOrders))

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

export { CloseTableController }
