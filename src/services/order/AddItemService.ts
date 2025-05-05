import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface ItemRequest {
  order_id: string
  product_id: string
  amount: number
  observation?: string
}

class AddItemService {
  async execute({
    order_id,
    product_id,
    amount,
    observation
  }: ItemRequest): Promise<AppResponse> {
    //retrive product information in order to verify if product exists
    const product = await prismaClient.product.findUnique({
      where: { id: product_id }
    })

    //verify if product exists
    if (!product) {
      throw new AppError('Produto não encontrado.', StatusCodes.NOT_FOUND)
    }

    if (amount <= 0) {
      throw new AppError(
        'A quantidade de produto deve ser maior que zero.',
        StatusCodes.BAD_REQUEST
      )
    }

    //retrieve order information in order to verify if order exists
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { items: true }
    })

    //verify if order exists
    if (!order) {
      throw new AppError('Pedido não encontrado.', StatusCodes.NOT_FOUND)
    }
    const total_value = amount * product.price

    const item = await prismaClient.item.create({
      data: {
        order_id,
        product_id,
        amount,
        unit_value: product.price,
        total_value,
        observation
      }
    })

    const total =
      order.items.reduce((sum, item) => sum + item.total_value, 0) + total_value

    await prismaClient.order.update({
      where: { id: order_id },
      data: { total }
    })

    return { data: item, message: 'Item adicionado ao pedido!' }
  }
}

export { AddItemService }
