"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const isAuthenticated_1 = require("./middlewares/isAuthenticated");
// Controllers
const CreateUserController_1 = require("./controllers/user/CreateUserController");
const AuthUserController_1 = require("./controllers/user/AuthUserController");
const DetailUserController_1 = require("./controllers/user/DetailUserController");
const RemoveUserController_1 = require("./controllers/user/RemoveUserController");
const ListUsersController_1 = require("./controllers/user/ListUsersController");
const UpdateUserController_1 = require("./controllers/user/UpdateUserController");
const CreateCategoryController_1 = require("./controllers/category/CreateCategoryController");
const ListCategoryController_1 = require("./controllers/category/ListCategoryController");
const RemoveCategoryController_1 = require("./controllers/category/RemoveCategoryController");
const CreateProductController_1 = require("./controllers/product/CreateProductController");
const ListByCategoryController_1 = require("./controllers/product/ListByCategoryController");
const ListProductsController_1 = require("./controllers/product/ListProductsController");
const RemoveProductController_1 = require("./controllers/product/RemoveProductController");
const UpdateProductController_1 = require("./controllers/product/UpdateProductController");
const CreateOrderController_1 = require("./controllers/order/CreateOrderController");
const RemoveOrderController_1 = require("./controllers/order/RemoveOrderController");
const AddItemController_1 = require("./controllers/order/AddItemController");
const RemoveItemController_1 = require("./controllers/order/RemoveItemController");
const SendOrderController_1 = require("./controllers/order/SendOrderController");
const ListOrdersController_1 = require("./controllers/order/ListOrdersController");
const DetailOrderController_1 = require("./controllers/order/DetailOrderController");
const FinishOrderController_1 = require("./controllers/order/FinishOrderController");
const CreateTableController_1 = require("./controllers/table/CreateTableController");
const ListTablesController_1 = require("./controllers/table/ListTablesController");
const UpdateTableStatusController_1 = require("./controllers/table/UpdateTableStatusController");
const GetTableDetailsController_1 = require("./controllers/table/GetTableDetailsController");
const CloseTableController_1 = require("./controllers/table/CloseTableController");
const DeleteTableController_1 = require("./controllers/table/DeleteTableController");
const PartialPaymentOrderController_1 = require("./controllers/payment/PartialPaymentOrderController");
const DeletePaymentOrderController_1 = require("./controllers/payment/DeletePaymentOrderController");
const UpdateCategoryController_1 = require("./controllers/category/UpdateCategoryController");
const logMiddleware_1 = require("./middlewares/logMiddleware");
const ListLogsController_1 = require("./controllers/log/ListLogsController");
const PrinterController_1 = require("./controllers/printer/PrinterController");
const router = (0, express_1.Router)();
exports.router = router;
// upload products using multer
//const upload = multer(uploadconfig.upload('./tmp'))
//Aplying logging middleware to all routes
router.use(logMiddleware_1.logMiddleware);
// -- User Routes --
router.post('/users', new CreateUserController_1.CreateUserController().handle);
router.post('/session', new AuthUserController_1.AuthUserController().handle);
router.get('/me', isAuthenticated_1.isAuthenticated, new DetailUserController_1.DetailUserController().handle);
router.delete('/users', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new RemoveUserController_1.RemoveUserController().handle);
router.get('/users', isAuthenticated_1.isAuthenticated, new ListUsersController_1.ListUsersController().handle);
router.put('/users', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new UpdateUserController_1.UpdateUserController().handle);
// -- Category Routes --
router.post('/category', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new CreateCategoryController_1.CreateCategoryController().handle);
router.get('/category', isAuthenticated_1.isAuthenticated, new ListCategoryController_1.ListCategoryController().handle);
router.delete('/category', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new RemoveCategoryController_1.RemoveCategoryController().handle);
router.put('/category', isAuthenticated_1.isAuthenticated, new UpdateCategoryController_1.UpdateCategoryController().handle);
// -- Product Routes --
// upload products using multer
// router.post('/product', isAuthenticated, isAdmin, upload.single('file'), new CreateProductController().handle)
// router.put('/product', isAuthenticated, isAdmin, upload.single('file'), new UpdateProductController().handle)
router.post('/product', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new CreateProductController_1.CreateProductController().handle);
router.put('/product', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new UpdateProductController_1.UpdateProductController().handle);
router.get('/category/product', isAuthenticated_1.isAuthenticated, new ListByCategoryController_1.ListByCategoryController().handle);
router.get('/products', isAuthenticated_1.isAuthenticated, new ListProductsController_1.ListProductsController().handle);
router.delete('/product', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new RemoveProductController_1.RemoveProductController().handle);
// -- Order Routes --
router.post('/order', isAuthenticated_1.isAuthenticated, new CreateOrderController_1.CreateOrderController().handle);
router.delete('/order', isAuthenticated_1.isAuthenticated, new RemoveOrderController_1.RemoveOrderController().handle);
router.post('/order/add', isAuthenticated_1.isAuthenticated, new AddItemController_1.AddItemController().handle);
router.delete('/order/remove', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new RemoveItemController_1.RemoveItemController().handle);
router.put('/order/send', isAuthenticated_1.isAuthenticated, new SendOrderController_1.SendOrderController().handle);
router.get('/orders', isAuthenticated_1.isAuthenticated, new ListOrdersController_1.ListOrdersController().handle);
router.get('/order/detail', isAuthenticated_1.isAuthenticated, new DetailOrderController_1.DetailOrderController().handle);
router.put('/order/finish', isAuthenticated_1.isAuthenticated, new FinishOrderController_1.FinishOrderController().handle);
// -- Table Routes --
router.post('/table', isAuthenticated_1.isAuthenticated, new CreateTableController_1.CreateTableController().handle);
router.get('/tables', isAuthenticated_1.isAuthenticated, new ListTablesController_1.ListTablesController().handle);
router.put('/table/status', isAuthenticated_1.isAuthenticated, new UpdateTableStatusController_1.UpdateTableStatusController().handle);
router.get('/table/detail', isAuthenticated_1.isAuthenticated, new GetTableDetailsController_1.GetTableDetailsController().handle);
router.put('/table/close', isAuthenticated_1.isAuthenticated, new CloseTableController_1.CloseTableController().handle);
router.delete('/table', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new DeleteTableController_1.DeleteTableController().handle);
// -- Payment Routes --
router.post('/order/payment', isAuthenticated_1.isAuthenticated, new PartialPaymentOrderController_1.PartialPaymentOrderController().handle);
router.delete('/order/payment', isAuthenticated_1.isAuthenticated, new DeletePaymentOrderController_1.DeletePaymentOrderController().handle);
// -- Logs Routes --
router.get('/logs', isAuthenticated_1.isAuthenticated, isAuthenticated_1.isAdmin, new ListLogsController_1.ListLogsController().handle);
// -- Printer Routes --
router.post('/printer/test', isAuthenticated_1.isAuthenticated, new PrinterController_1.PrinterController().testConection);
router.post('/printer/order', isAuthenticated_1.isAuthenticated, new PrinterController_1.PrinterController().printOrderToKitchen);
