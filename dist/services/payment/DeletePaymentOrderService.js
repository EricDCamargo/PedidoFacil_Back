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
exports.DeletePaymentOrderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
const types_1 = require("../../@types/types");
class DeletePaymentOrderService {
    execute({ payment_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payment_id) {
                throw new AppError_1.AppError('ID do pagamento necessario!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const payment = yield prisma_1.default.payment.findUnique({
                where: { id: payment_id },
                include: { paymentOrders: true }
            });
            if (!payment) {
                throw new AppError_1.AppError('Pagamento não encontrado!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const paymentOrder = payment.paymentOrders[0];
            if (!paymentOrder) {
                throw new AppError_1.AppError('Pagamento não está associado a um pedido!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const order_id = paymentOrder.order_id;
            // Deletar registros na tabela PaymentOrder primeiro
            yield prisma_1.default.paymentOrder.deleteMany({
                where: { payment_id }
            });
            // Após remover as referências, deletar o pagamento
            yield prisma_1.default.payment.delete({
                where: { id: payment_id }
            });
            const order = yield prisma_1.default.order.findUnique({
                where: { id: order_id },
                include: { paymentOrders: true }
            });
            const totalPaid = order.paymentOrders.reduce((sum, p) => sum + p.value, 0);
            if (totalPaid < order.total) {
                yield prisma_1.default.order.update({
                    where: { id: order_id },
                    data: { status: types_1.OrderStatus.COMPLETED }
                });
            }
            return {
                message: 'Pagamento removido com sucesso!'
            };
        });
    }
}
exports.DeletePaymentOrderService = DeletePaymentOrderService;
