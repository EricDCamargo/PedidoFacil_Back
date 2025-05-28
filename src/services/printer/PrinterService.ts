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
import { OrderStatus } from '../../@types/types'
import { StatusCodes } from 'http-status-codes'

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
  private printer: ThermalPrinter

  constructor() {
    this.printer = new ThermalPrinter({
      type: PrinterTypes.DARUMA,
      interface: process.env.PRINTER_INTERFACE,
      characterSet: CharacterSet.PC860_PORTUGUESE,
      removeSpecialCharacters: false,
      lineCharacter: '=',
      breakLine: BreakLine.WORD,
      options: {
        timeout: 5000
      }
    })
  }

  async isPrinterConnected(): Promise<boolean> {
    return await this.printer.isPrinterConnected()
  }

  async printPaidOrders(paidOrders: KitchenOrder[]): Promise<void> {
    const { number } = await prismaClient.table.findUnique({
      where: { id: paidOrders[0].table_id },
      select: { number: true }
    })

    this.printer.alignCenter()

    this.printer.println('*** COMPROVANTE DE PAGAMENTO ***')

    this.printer.println(`Mesa: ${number}`)
    this.printer.println(`Data: ${new Date().toLocaleString()}`)
    this.printer.drawLine()

    let globalIndex = 1
    let totalGeral = 0

    for (const order of paidOrders) {
      this.printer.println(`Pedido #${order.number}`)

      this.printer.println('-------------------------------------------')
      this.printer.println('Item  Produto         Qtd  V.Unit   V.Total')
      this.printer.println('-------------------------------------------')

      let totalPedido = 0

      for (const item of order.items) {
        const nome = (item.product.name || '').padEnd(14).substring(0, 14)
        const qtd = String(item.amount).padStart(3)
        const vUnit = `R$${item.unit_value.toFixed(2)}`.padStart(7)
        const vTotal = `R$${item.total_value.toFixed(2)}`.padStart(8)
        this.printer.println(
          `${globalIndex.toString().padEnd(4)} ${nome}${qtd} ${vUnit} ${vTotal}`
        )
        totalPedido += item.total_value
        globalIndex++
      }

      this.printer.println('-------------------------------------------')

      this.printer.println(`Total do Pedido: R$${totalPedido.toFixed(2)}`)

      this.printer.drawLine()
      totalGeral += totalPedido
    }

    this.printer.println(`TOTAL GERAL: R$${totalGeral.toFixed(2)}`)

    this.printer.drawLine()
    this.printer.newLine()
    this.printer.cut()

    const isPrinted = await this.printer.execute()
    if (!isPrinted) {
      throw new AppError(
        'Erro ao imprimir o comprovante.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  async printKitchenOrder(order_id: string): Promise<AppResponse> {
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

    this.printer.alignCenter()
    this.printer.setTextDoubleHeight()
    this.printer.println('*** COZINHA ***')

    this.printer.drawLine()
    this.printer.alignLeft()
    this.printer.println(`PEDIDO: #${order.number}`)
    this.printer.println(`MESA: ${order.table.number}`)
    this.printer.println(`CLIENTE: ${order.name || '-'}`)
    this.printer.println(`STATUS: ${statusPt[order.status] || order.status}`)
    this.printer.println(`DATA: ${new Date(order.created_at).toLocaleString()}`)
    this.printer.drawLine()
    this.printer.println('ITENS:')

    for (const item of order.items) {
      this.printer.println(`- ${item.amount}x ${item.product.name}`)
      if (item.observation && item.observation.trim() !== '') {
        this.printer.println(`  Obs: ${item.observation}`)
      }
    }

    this.printer.drawLine()
    this.printer.newLine()
    this.printer.drawLine()

    this.printer.cut()

    const isPrinted = await this.printer.execute()
    if (!isPrinted) {
      throw new AppError(
        'Erro ao imprimir o pedido na cozinha.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
    return {
      message: 'Pedido impresso com sucesso na cozinha!'
    }
  }

  async testPrinterConnection(): Promise<AppResponse> {
    console.log('PRINTER_INTERFACE:', process.env.PRINTER_INTERFACE)
    this.printer.alignCenter()
    this.printer.println('Teste de Conexão')
    this.printer.newLine()
    this.printer.newLine()
    this.printer.newLine()
    this.printer.drawLine()
    this.printer.cut()
    const isPrinted = await this.printer.execute()
    if (!isPrinted) {
      throw new AppError('Erro ao imprimir o teste de conexão.')
    }
    return { message: 'Teste de conexão realizado com sucesso!' }
  }
}

export { PrinterService }
