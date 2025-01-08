import prismaClient from '../../prisma'

interface CategoryRequest {
  category_id: string
}

class DeleteCategoryService {
  async execute({ category_id }: CategoryRequest) {
    const categoryExists = await prismaClient.category.findFirst({
      where: { id: category_id }
    })

    if (!categoryExists) {
      throw new Error('Category not found')
    }

    await prismaClient.category.delete({
      where: { id: category_id }
    })

    return { message: 'Category deleted successfully' }
  }
}

export { DeleteCategoryService }
