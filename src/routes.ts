import { Router } from 'express'
import multer from 'multer'
import uploadconfig from './config/multer'

import { isAuthenticated, isAdmin } from './middlewares/isAuthenticated'

// Controllers
import { CreateUserController } from './controllers/user/CreateUserController'
import { AuthUserController } from './controllers/user/AuthUserController'
import { DetailUserController } from './controllers/user/DetailUserController'
import { RemoveUserController } from './controllers/user/RemoveUserController'
import { ListUsersController } from './controllers/user/ListUsersController'
import { UpdateUserController } from './controllers/user/UpdateUserController'

import { CreateCategoryController } from './controllers/category/CreateCategoryController'
import { ListCategoryController } from './controllers/category/ListCategoryController'
import { RemoveCategoryController } from './controllers/category/RemoveCategoryController'

import { CreateProductController } from './controllers/product/CreateProductController'
import { ListByCategoryController } from './controllers/product/ListByCategoryController'
import { ListProductsController } from './controllers/product/ListProductsController'
import { RemoveProductController } from './controllers/product/RemoveProductController'
import { UpdateProductController } from './controllers/product/UpdateProductController'

import { CreateOrderController } from './controllers/order/CreateOrderController'
import { RemoveOrderController } from './controllers/order/RemoveOrderController'
import { AddItemController } from './controllers/order/AddItemController'
import { RemoveItemController } from './controllers/order/RemoveItemController'
import { SendOrderController } from './controllers/order/SendOrderController'
import { ListOrdersController } from './controllers/order/ListOrdersController'
import { DetailOrderController } from './controllers/order/DetailOrderController'
import { FinishOrderController } from './controllers/order/FinishOrderController'

import { CreateTableController } from './controllers/table/CreateTableController'
import { ListTablesController } from './controllers/table/ListTablesController'
import { UpdateTableStatusController } from './controllers/table/UpdateTableStatusController'
import { GetTableDetailsController } from './controllers/table/GetTableDetailsController'
import { CloseTableController } from './controllers/table/CloseTableController'
import { DeleteTableController } from './controllers/table/DeleteTableController'

const router = Router()

// upload products using multer
//const upload = multer(uploadconfig.upload('./tmp'))

// -- User Routes --
router.post('/users', new CreateUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated, new DetailUserController().handle)
router.delete('/users', isAuthenticated, isAdmin, new RemoveUserController().handle)
router.get('/users', isAuthenticated, new ListUsersController().handle)
router.put('/users', isAuthenticated, isAdmin, new UpdateUserController().handle)

// -- Category Routes --
router.post('/category', isAuthenticated, isAdmin, new CreateCategoryController().handle)
router.get('/category', isAuthenticated, new ListCategoryController().handle)
router.delete('/category', isAuthenticated, isAdmin, new RemoveCategoryController().handle)

// -- Product Routes --

// upload products using multer
// router.post('/product', isAuthenticated, isAdmin, upload.single('file'), new CreateProductController().handle)
// router.put('/product', isAuthenticated, isAdmin, upload.single('file'), new UpdateProductController().handle)

router.post('/product', isAuthenticated, isAdmin, new CreateProductController().handle)
router.put('/product', isAuthenticated, isAdmin, new UpdateProductController().handle)
router.get('/category/product', isAuthenticated, new ListByCategoryController().handle)
router.get('/products', isAuthenticated, new ListProductsController().handle)
router.delete('/product', isAuthenticated, isAdmin, new RemoveProductController().handle)

// -- Order Routes --
router.post('/order', isAuthenticated, new CreateOrderController().handle)
router.delete('/order', isAuthenticated, new RemoveOrderController().handle)
router.post('/order/add', isAuthenticated, new AddItemController().handle)
router.delete('/order/remove', isAuthenticated, isAdmin, new RemoveItemController().handle)
router.put('/order/send', isAuthenticated, new SendOrderController().handle)
router.get('/orders', isAuthenticated, new ListOrdersController().handle)
router.get('/order/detail', isAuthenticated, new DetailOrderController().handle)
router.put('/order/finish', isAuthenticated, new FinishOrderController().handle)

// -- Table Routes --
router.post('/table', isAuthenticated, new CreateTableController().handle)
router.get('/tables', isAuthenticated, new ListTablesController().handle)
router.put('/table/status', isAuthenticated, new UpdateTableStatusController().handle)
router.get('/table/detail', isAuthenticated, new GetTableDetailsController().handle)
router.put('/table/close', isAuthenticated, new CloseTableController().handle)
router.delete('/table', isAuthenticated, isAdmin, new DeleteTableController().handle)

export { router }
