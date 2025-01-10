import prismaClient from '../../prisma'

interface CloseTableRequest {
  table_id: string
  payment_method: string
}

class CloseTableService {
  async execute({ table_id, payment_method }: CloseTableRequest) {
    // Verificar se a mesa existe e está ocupada
    const table = await prismaClient.table.findUnique({
      where: { id: table_id }
    })

    if (!table) {
      throw new Error('Mesa não encontrada.')
    }

    if (table.status !== 'occupied') {
      throw new Error('A mesa não está ocupada.')
    }

    if (!payment_method) {
      throw new Error('Forma de pagamento não informada.')
    }

    // Obter todos os pedidos completados da mesa
    const orders = await prismaClient.order.findMany({
      where: { table_id, status: 'completed' }
    })

    if (orders.length === 0) {
      throw new Error('Não há pedidos para fechar.')
    }

    // Calcular o valor total dos pedidos
    const totalAmount = orders.reduce(
      (total, order) => total + (order.total || 0),
      0
    )

    // Registrar o pagamento
    await prismaClient.payment.create({
      data: {
        order_id: orders[0].id, // Associar o pagamento ao primeiro pedido (ou criar um novo campo para associar a todos)
        amount: totalAmount,
        payment_method
      }
    })

    // Atualizar o status dos pedidos para 'closed'
    await prismaClient.order.updateMany({
      where: { table_id, status: 'completed' },
      data: { status: 'closed' }
    })

    // Atualizar o status da mesa para 'available'
    await prismaClient.table.update({
      where: { id: table_id },
      data: { status: 'available' }
    })

    return { message: 'Conta fechada com sucesso' }
  }
}

export { CloseTableService }
