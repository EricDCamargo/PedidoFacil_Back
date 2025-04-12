import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer'
import { Order, Item } from '@prisma/client'
import prismaClient from '../../prisma'

interface KitchenOrder extends Order {
  items: (Item & { product: { name: string } })[]
}

class PrinterService {
  private printer: any

  constructor() {
    this.printer = new ThermalPrinter({
      type: PrinterTypes.EPSON, // Tipo da impressora (ajuste conforme necessário)
      interface: 'usb' // Interface da impressora
    })
  }

  async printPaidOrders(paidOrders: KitchenOrder[]): Promise<void> {
    const { number } = await prismaClient.table.findUnique({
      where: { id: paidOrders[0].table_id },
      select: { number: true }
    })
    // Cabeçalho
    this.printer.println('Comprovante de Pagamento')
    this.printer.println(`Mesa: ${number}`)
    this.printer.println(`Data: ${new Date().toLocaleString()}`)
    this.printer.drawLine()

    // Detalhes dos pedidos pagos
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

    // Finalizar e cortar o comprovante
    this.printer.cut()

    // Tentar imprimir
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
    // Cabeçalho
    this.printer.println('Pedido para Cozinha')
    this.printer.println(`Pedido #${order.number}`)
    this.printer.println(`Mesa: ${number}`)
    this.printer.println(`Data: ${new Date().toLocaleString()}`)
    this.printer.drawLine()

    // Detalhes dos itens do pedido
    for (const item of order.items) {
      this.printer.println(
        `${item.amount}x ${item.product.name} - R$${item.unit_value.toFixed(2)}`
      )
      if (item.observation) {
        this.printer.println(`  Observação: ${item.observation}`)
      }
    }

    this.printer.drawLine()
    this.printer.println('Por favor, preparar com atenção!')
    this.printer.cut()

    // Tentar imprimir
    const isPrinted = await this.printer.execute()
    if (!isPrinted) {
      throw new Error('Erro ao imprimir o pedido na cozinha.')
    }
  }

  async testPrintPaidOrders(paidOrders: KitchenOrder[]): Promise<void> {
    const { number } = await prismaClient.table.findUnique({
      where: { id: paidOrders[0].table_id },
      select: { number: true }
    })

    console.log('--- Comprovante de Pagamento ---')
    console.log(`Mesa: ${number}`)
    console.log(`Data: ${new Date().toLocaleString()}`)
    console.log('-------------------------------')

    for (const order of paidOrders) {
      console.log(`Pedido #${order.number}`)
      for (const item of order.items) {
        console.log(
          `  ${item.amount}x ${
            item.product.name
          } - R$${item.total_value.toFixed(2)}`
        )
      }
      console.log(`Total do Pedido: R$${order.total.toFixed(2)}`)
      console.log('-------------------------------')
    }
  }

  async testPrintKitchenOrder(order: KitchenOrder): Promise<void> {
    const { number } = await prismaClient.table.findUnique({
      where: { id: order.table_id },
      select: { number: true }
    })

    console.log('--- Pedido para Cozinha ---')
    console.log(`Pedido #${order.number}`)
    console.log(`Mesa: ${number}`)
    console.log(`Data: ${new Date().toLocaleString()}`)
    console.log('---------------------------')

    for (const item of order.items) {
      console.log(
        `${item.amount}x ${item.product.name} - R$${item.unit_value.toFixed(2)}`
      )
      if (item.observation) {
        console.log(`  Observação: ${item.observation}`)
      }
    }

    console.log('---------------------------')
    console.log('Por favor, preparar com atenção!')
  }
}

export { PrinterService }
