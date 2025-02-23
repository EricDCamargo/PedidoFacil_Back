"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderController = void 0;
const CreateOrderService_1 = require("../../services/order/CreateOrderService");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
class CreateOrderController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { table_id, name } = req.body;
            const createOrderService = new CreateOrderService_1.CreateOrderService();
            try {
                const order = yield createOrderService.execute({ table_id, name });
                return res.status(http_status_codes_1.StatusCodes.CREATED).json(order);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.CreateOrderController = CreateOrderController;
