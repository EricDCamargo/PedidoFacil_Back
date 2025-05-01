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

interface KitchenOrder extends Order {
  items: (Item & { product: { name: string } })[]
}

class PrinterService {
  private printer: ThermalPrinter

  constructor() {
    this.printer = new ThermalPrinter({
      type: PrinterTypes.DARUMA,
      interface: '//localhost/Daruma',
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
    this.printer.println('Comprovante de Pagamento')
    this.printer.println(`Mesa: ${number}`)
    this.printer.println(`Data: ${new Date().toLocaleString()}`)
    this.printer.drawLine()

    for (const order of paidOrders) {
      this.printer.println(`Pedido #${order.number}`)
      for (const item of order.items) {
        this.printer.println(
          `  ${item.amount}x ${
            item.product.name
          } - R$${item.total_value.toFixed(2)}`
        )
      }
      this.printer.println(`Total do Pedido: R$${order.total.toFixed(2)}`)
      this.printer.drawLine()
    }

    this.printer.cut()

    const isPrinted = await this.printer.execute()
    if (!isPrinted) {
      throw new Error('Erro ao imprimir o comprovante.')
    }
  }

  async printKitchenOrder(order: KitchenOrder): Promise<void> {
    const { number } = await prismaClient.table.findUnique({
      where: { id: order.table_id },
      select: { number: true }
    })

    this.printer.alignCenter()
    this.printer.println('Pedido para Cozinha')
    this.printer.println(`Pedido #${order.number}`)
    this.printer.println(`Mesa: ${number}`)
    this.printer.println(`Data: ${new Date().toLocaleString()}`)
    this.printer.drawLine()
    this.printer.newLine()

    for (const item of order.items) {
      this.printer.println(`${item.amount}x ${item.product.name}`)
      if (item.observation) {
        this.printer.println(`  Observação: ${item.observation}`)
      }
    }

    this.printer.drawLine()
    this.printer.println('Por favor, preparar com atenção!')
    this.printer.newLine()
    this.printer.newLine()
    this.printer.newLine()
    this.printer.cut()

    const isPrinted = await this.printer.execute()
    if (!isPrinted) {
      throw new Error('Erro ao imprimir o pedido na cozinha.')
    }
  }

  async testPrinterConnection(): Promise<AppResponse> {
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
