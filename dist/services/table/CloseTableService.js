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
exports.CloseTableService = void 0;
const http_status_codes_1 = require("http-status-codes");
const types_1 = require("../../@types/types");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class CloseTableService {
    execute({ table_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { AVAILABLE, OCCUPIED } = types_1.TableStatus;
            const { PAID, COMPLETED, CLOSED } = types_1.OrderStatus;
            const table = yield prisma_1.default.table.findUnique({
                where: { id: table_id }
            });
            if (!table) {
                throw new AppError_1.AppError('Mesa não encontrada!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (table.status !== OCCUPIED) {
                throw new AppError_1.AppError('A mesa não está ocupada!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const orders = yield prisma_1.default.order.findMany({
                where: { table_id },
                include: { paymentOrders: true }
            });
            if (orders.length === 0) {
                throw new AppError_1.AppError('Não há pedidos nessa mesa!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const openOrderStatuses = [
                types_1.OrderStatus.DRAFT,
                types_1.OrderStatus.IN_PROGRESS,
                types_1.OrderStatus.COMPLETED
            ];
            const hasOpenOrders = yield prisma_1.default.order.findFirst({
                where: {
                    table_id,
                    status: {
                        in: openOrderStatuses
                    }
                }
            });
            if (hasOpenOrders) {
                throw new AppError_1.AppError('Não é possível fechar a mesa: existem pedidos em aberto!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Get the total of paid and completed orders
            const { _sum: { total: totalOrders = 0 } = {} } = yield prisma_1.default.order.aggregate({
                where: { table_id, status: { in: [PAID, COMPLETED] } },
                _sum: { total: true }
            });
            // Get the total of payments made
            const { _sum: { value: totalPayments = 0 } = {} } = yield prisma_1.default.paymentOrder.aggregate({
                where: { order: { table_id, status: { in: [PAID, COMPLETED] } } },
                _sum: { value: true }
            });
            // Validation: were all paid orders paid off?
            if (totalPayments < totalOrders) {
                throw new AppError_1.AppError('Nem todos os pedidos pagos foram quitados!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield prisma_1.default.order.updateMany({
                where: { table_id, status: PAID },
                data: { status: CLOSED }
            });
            yield prisma_1.default.table.update({
                where: { id: table_id },
                data: { status: AVAILABLE }
            });
            return { message: 'Mesa fechada com sucesso!' };
        });
    }
}
exports.CloseTableService = CloseTableService;
