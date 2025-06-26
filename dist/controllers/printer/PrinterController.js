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
exports.PrinterController = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const PrinterService_1 = require("../../services/printer/PrinterService");
class PrinterController {
    testConection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const printerService = new PrinterService_1.PrinterService();
            try {
                const print = yield printerService.testPrinterConnection();
                return res.status(http_status_codes_1.StatusCodes.OK).json(print);
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
    printOrderToKitchen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const order_id = req.query.order_id;
            const printerService = new PrinterService_1.PrinterService();
            try {
                const print = yield printerService.printKitchenOrder(order_id);
                return res.status(http_status_codes_1.StatusCodes.OK).json(print);
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
exports.PrinterController = PrinterController;
