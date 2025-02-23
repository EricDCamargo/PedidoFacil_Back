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
exports.RemoveOrderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const types_1 = require("../../@types/types");
const prisma_1 = __importDefault(require("../../prisma"));
const server_1 = require("../../server");
class RemoveOrderService {
    execute({ order_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { COMPLETED, PAID, CLOSED } = types_1.OrderStatus;
            const order = yield prisma_1.default.order.findUnique({
                where: { id: order_id },
                include: {
                    items: true
                }
            });
            if (!order) {
                throw new AppError_1.AppError('Pedido não encontrado.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (order.status === COMPLETED) {
                throw new AppError_1.AppError('O pedido não pode ser removido pois já foi ENTREGUE.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (order.status === PAID) {
                throw new AppError_1.AppError('O pedido não pode ser removido pois já foi PAGO.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (order.status === CLOSED) {
                throw new AppError_1.AppError('O pedido não pode ser removido pois já foi FECHADO.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (order.items.length > 0) {
                yield prisma_1.default.item.deleteMany({
                    where: { order_id }
                });
            }
            const deletedOrder = yield prisma_1.default.order.delete({
                where: { id: order_id }
            });
            // Check if there are any remaining orders for the table
            const hasRemainingOrders = yield prisma_1.default.order.findFirst({
                where: {
                    table_id: order.table_id,
                    status: {
                        not: types_1.OrderStatus.CLOSED
                    }
                }
            });
            if (!hasRemainingOrders) {
                yield prisma_1.default.table
                    .update({
                    where: { id: order.table_id },
                    data: { status: types_1.TableStatus.AVAILABLE }
                })
                    .then(() => {
                    server_1.io.emit('tableStatusChanged');
                });
            }
            return { data: deletedOrder, message: 'Pedido removido com sucesso.' };
        });
    }
}
exports.RemoveOrderService = RemoveOrderService;
