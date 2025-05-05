import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface ProductRequest {
  name: string
  price: number
  description: string
  banner: string
  category_id: string
}

class CreateProductService {
  async execute({
    name,
    price,
    description,
    banner,
    category_id
  }: ProductRequest): Promise<AppResponse> {
    if (!name || !price || !description || !banner || !category_id) {
      throw new AppError(
        'Todos os campos são obrigatórios!',
        StatusCodes.BAD_REQUEST
      )
    }
    if (typeof price !== 'number') {
      throw new AppError(
        'Price must be provided as a number',
        StatusCodes.BAD_REQUEST
      )
    }

    // Verificar se já existe um produto com o mesmo nome
    const existingProduct = await prismaClient.product.findUnique({
      where: { name }
    })

    if (existingProduct) {
      throw new AppError(
        'Já existe um produto com esse nome!',
        StatusCodes.CONFLICT
      )
    }

    const product = await prismaClient.product.create({
      data: {
        name,
        price,
        description,
        banner,
        category_id
      }
    })
    return { data: product, message: 'Produto cadastrado com sucesso!' }
  }
}

export { CreateProductService }
