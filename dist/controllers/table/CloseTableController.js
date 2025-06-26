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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseTableController = void 0;
const CloseTableService_1 = require("../../services/table/CloseTableService");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
const types_1 = require("../../@types/types");
const PrinterService_1 = require("../../services/printer/PrinterService");
class CloseTableController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const table_id = req.query.table_id;
            const closeTableService = new CloseTableService_1.CloseTableService();
            const printerService = new PrinterService_1.PrinterService();
            try {
                // Search for orders with open status, if there are any, it´s not possible to close the table.
                const hasOpenOrders = yield prisma_1.default.order.findFirst({
                    where: {
                        table_id,
                        status: {
                            in: [
                                types_1.OrderStatus.DRAFT,
                                types_1.OrderStatus.IN_PROGRESS,
                                types_1.OrderStatus.COMPLETED
                            ]
                        }
                    }
                });
                if (hasOpenOrders) {
                    throw new AppError_1.AppError('Não é possível fechar a mesa: existem pedidos em aberto!', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const paidOrders = yield prisma_1.default.order.findMany({
                    where: {
                        table_id,
                        status: 'PAID'
                    },
                    include: {
                        items: { include: { product: true } }
                    }
                });
                const result = yield closeTableService.execute({ table_id });
                try {
                    yield printerService.printPaidOrders(paidOrders);
                }
                catch (err) {
                    const printError = err instanceof AppError_1.AppError
                        ? err.message
                        : 'Erro inesperado durante execução do serviço de impressão.';
                    result.message = result.message
                        ? `${result.message} (Observação: ${printError})`
                        : `Observação: ${printError}`;
                }
                return res.status(http_status_codes_1.StatusCodes.OK).json(result);
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
exports.CloseTableController = CloseTableController;
