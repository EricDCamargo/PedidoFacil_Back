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
exports.SendOrderController = void 0;
const SendOrderService_1 = require("../../services/order/SendOrderService");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const PrinterService_1 = require("../../services/printer/PrinterService");
class SendOrderController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { order_id } = req.body;
            const sendOrder = new SendOrderService_1.SendOrderService();
            const printerService = new PrinterService_1.PrinterService();
            try {
                const orderResponse = yield sendOrder.execute({ order_id });
                try {
                    yield printerService.printKitchenOrder(order_id);
                }
                catch (err) {
                    const printError = err instanceof AppError_1.AppError
                        ? err.message
                        : 'Erro inesperado durante execução do serviço de impressão.';
                    orderResponse.message = orderResponse.message
                        ? `${orderResponse.message} (Observação: ${printError})`
                        : `Observação: ${printError}`;
                }
                return res.status(http_status_codes_1.StatusCodes.OK).json(orderResponse);
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
exports.SendOrderController = SendOrderController;
