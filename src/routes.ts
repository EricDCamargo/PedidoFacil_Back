import { Router } from 'express'
import multer from 'multer'
import uploadconfig from './config/multer'

import { CreateUserController } from './controllers/user/CreateUserController'
import { AuthUserController } from './controllers/user/AuthUserController'
import { DetailUserController } from './controllers/user/DetailUserController'
import { isAuthenticated } from './middlewares/isAuthenticated'
import { CreateCategoryController } from './controllers/category/CreateCategoryController'
import { ListCategoryController } from './controllers/category/ListCategoryController'
import { CreateProductController } from './controllers/product/CreateProductController'
import { ListByCategoryController } from './controllers/product/ListByCategoryController'
import { CreateOrderController } from './controllers/order/CreateOrderController'
import { RemoveOrderController } from './controllers/order/RemoveOrderController'
import { AddItemController } from './controllers/order/AddItemController'
import { RemoveItemController } from './controllers/order/RemoveItemController'
import { SendOrderController } from './controllers/order/SendOrderController'
import { ListOrdersController } from './controllers/order/ListOrdersController'
import { DetailOrderController } from './controllers/order/DetailOrderController'
import { FinishOrderController } from './controllers/order/FinishOrderController'
import { RemoveUserController } from './controllers/user/RemoveUserController'
import { ListUsersController } from './controllers/user/ListUsersController'
import { UpdateUserController } from './controllers/user/UpdateUserController'
import { RemoveCategoryController } from './controllers/category/RemoveCategoryController'
import { RemoveProductController } from './controllers/product/RemoveProductController'
import { UpdateProductController } from './controllers/product/UpdateProductController'

const router = Router()

const upload = multer(uploadconfig.upload('./tmp'))

// -- User Routes --
router.post('/users', new CreateUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated, new DetailUserController().handle)
router.delete('/users', isAuthenticated, new RemoveUserController().handle)
router.get('/users', isAuthenticated, new ListUsersController().handle)
router.put('/users', isAuthenticated, new UpdateUserController().handle)

// -- Category Routes --

router.post('/category', isAuthenticated, new CreateCategoryController().handle)
router.get('/category', isAuthenticated, new ListCategoryController().handle)
router.delete('/category', isAuthenticated, new RemoveCategoryController().handle)

// -- Product Routes --

router.post('/product', isAuthenticated, upload.single('file'), new CreateProductController().handle)
router.get('/category/product', isAuthenticated, new ListByCategoryController().handle)
router.delete('/product', isAuthenticated, new RemoveProductController().handle)
router.put('/product', isAuthenticated, upload.single('file'), new UpdateProductController().handle)

// -- Order Routes --

router.post('/order', isAuthenticated, new CreateOrderController().handle)
router.delete('/order', isAuthenticated, new RemoveOrderController().handle)
router.post('/order/add', isAuthenticated, new AddItemController().handle)
router.delete('/order/remove', isAuthenticated, new RemoveItemController().handle)

router.put('/order/send', isAuthenticated, new SendOrderController().handle)
router.get('/orders', isAuthenticated, new ListOrdersController().handle)
router.get('/order/detail', isAuthenticated, new DetailOrderController().handle)

router.put('/order/finish', isAuthenticated, new FinishOrderController().handle)

export { router }
