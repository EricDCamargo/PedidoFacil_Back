import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  BreakLine
} from 'node-thermal-printer'
import { Order, Item } from '@prisma/client'
import prismaClient from '../../prisma'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { SerialPort } from 'serialport'

interface KitchenOrder extends Order {
  items: (Item & { product: { name: string } })[]
}

const statusPt: Record<string, string> = {
  DRAFT: 'Rascunho',
  IN_PROGRESS: 'Em preparo',
  COMPLETED: 'Finalizado',
  PAID: 'Pago',
  CLOSED: 'Fechado'
}

class PrinterService {
  private printerInterface: string

  constructor() {
    this.printerInterface = process.env.PRINTER_INTERFACE
  }
  static async checkSerialPort(): Promise<boolean> {
    for (const baudRate of [115200]) {
      try {
        const port = new SerialPort({
          path: process.env.PRINTER_INTERFACE,
          baudRate,
          autoOpen: false
        })
        await new Promise<void>((resolve, reject) => {
          port.open(err => (err ? reject(err) : resolve()))
        })
        port.close()
        return true
      } catch (err) {
        console.warn(`Falha ao testar porta serial em ${baudRate}:`, err)
      }
    }
    return false
  }

  private async checkPortConection(): Promise<void> {
    const portOk = await PrinterService.checkSerialPort()
    if (!portOk) {
      throw new AppError(
        'Impressora não conectada ou porta inacessível.',
        StatusCodes.SERVICE_UNAVAILABLE
      )
    }
  }

  private async initializePrinter(): Promise<ThermalPrinter> {
    await this.checkPortConection()
    return new ThermalPrinter({
      type: PrinterTypes.DARUMA,
      interface: this.printerInterface,
      characterSet: CharacterSet.PC860_PORTUGUESE,
      removeSpecialCharacters: false,
      lineCharacter: '=',
      breakLine: BreakLine.WORD,
      options: {
        timeout: 5000
      }
    })
  }

  async printPaidOrders(paidOrders: KitchenOrder[]): Promise<AppResponse> {
    try {
      const printer = await this.initializePrinter()

      const { number } = await prismaClient.table.findUnique({
        where: { id: paidOrders[0].table_id },
        select: { number: true }
      })

      printer.alignCenter()
      printer.println('*** COMPROVANTE DE PAGAMENTO ***')
      printer.println(`Mesa: ${number}`)
      printer.println(`Data: ${new Date().toLocaleString()}`)
      printer.drawLine()

      let globalIndex = 1
      let totalGeral = 0

      for (const order of paidOrders) {
        printer.println(`Pedido #${order.number}`)
        printer.println('-------------------------------------------')
        printer.println('Item  Produto         Qtd  V.Unit   V.Total')
        printer.println('-------------------------------------------')

        let totalPedido = 0

        for (const item of order.items) {
          const nome = (item.product.name || '').padEnd(14).substring(0, 14)
          const qtd = String(item.amount).padStart(3)
          const vUnit = `R$${item.unit_value.toFixed(2)}`.padStart(7)
          const vTotal = `R$${item.total_value.toFixed(2)}`.padStart(8)
          printer.println(
            `${globalIndex
              .toString()
              .padEnd(4)} ${nome}${qtd} ${vUnit} ${vTotal}`
          )
          totalPedido += item.total_value
          globalIndex++
        }

        printer.println('-------------------------------------------')
        printer.println(`Total do Pedido: R$${totalPedido.toFixed(2)}`)
        printer.drawLine()
        totalGeral += totalPedido
      }

      printer.println(`TOTAL GERAL: R$${totalGeral.toFixed(2)}`)
      printer.drawLine()
      printer.newLine()
      printer.cut()

      const isPrinted = await printer.execute()
      if (!isPrinted) {
        throw new AppError('Erro ao imprimir o comprovante.')
      }
      return {
        message: 'Comprovante impresso com sucesso!'
      }
    } catch (err) {
      const msg = err instanceof AppError ? err.message : 'Erro ao imprimir.'
      throw new AppError(msg)
    }
  }

  async printKitchenOrder(order_id: string): Promise<AppResponse> {
    try {
      const printer = await this.initializePrinter()

      const order = await prismaClient.order.findUnique({
        where: { id: order_id },
        include: {
          items: {
            include: {
              product: { select: { name: true } }
            }
          },
          table: {
            select: { number: true }
          }
        }
      })

      printer.alignCenter()
      printer.setTextDoubleHeight()
      printer.println('*** COZINHA ***')
      printer.drawLine()
      printer.alignLeft()
      printer.println(`PEDIDO: #${order.number}`)
      printer.println(`MESA: ${order.table.number}`)
      printer.println(`CLIENTE: ${order.name || '-'}`)
      printer.println(`STATUS: ${statusPt[order.status] || order.status}`)
      printer.println(`DATA: ${new Date(order.created_at).toLocaleString()}`)
      printer.drawLine()
      printer.println('ITENS:')

      for (const item of order.items) {
        printer.println(`- ${item.amount}x ${item.product.name}`)
        if (item.observation?.trim()) {
          printer.println(`  Obs: ${item.observation}`)
        }
      }

      printer.drawLine()
      printer.newLine()
      printer.drawLine()
      printer.cut()

      const isPrinted = await printer.execute()
      if (!isPrinted) {
        throw new AppError('Erro ao imprimir o pedido na cozinha.')
      }
      return {
        message: 'Pedido impresso com sucesso na cozinha!'
      }
    } catch (err) {
      const msg = err instanceof AppError ? err.message : 'Erro ao imprimir.'
      throw new AppError(msg)
    }
  }

  async testPrinterConnection(): Promise<AppResponse> {
    try {
      const printer = await this.initializePrinter()
      printer.alignCenter()
      printer.println('Teste de Conexão')
      printer.newLine()
      printer.drawLine()
      printer.cut()

      const isPrinted = await printer.execute()
      if (!isPrinted) {
        throw new AppError(
          'Impressora não conectada ou inacessível.',
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      }
      return { message: 'Teste de conexão realizado com sucesso!' }
    } catch (err) {
      const msg = err instanceof AppError ? err.message : 'Erro ao imprimir.'
      throw new AppError(msg)
    }
  }
}

export { PrinterService }
