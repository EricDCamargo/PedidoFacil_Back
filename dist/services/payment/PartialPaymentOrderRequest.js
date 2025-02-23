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
exports.PartialPaymentOrderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const types_1 = require("../../@types/types");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class PartialPaymentOrderService {
    execute({ order_id, payment_method, value }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { PAID, IN_PROGRESS, CLOSED, DRAFT } = types_1.OrderStatus;
            if (!order_id || !payment_method || !value || value <= 0) {
                throw new AppError_1.AppError('Dados do pagamento inválidos!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const order = yield prisma_1.default.order.findUnique({
                where: { id: order_id },
                include: { paymentOrders: true }
            });
            if (!order) {
                throw new AppError_1.AppError('Pedido não encontrado!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if ([DRAFT, IN_PROGRESS, CLOSED].includes(order.status)) {
                throw new AppError_1.AppError(`Pedido com status '${order.status}', não é possível registrar pagamento!`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const orderValue = order.total || 0;
            // Calcular o total pago
            const totalPaid = order.paymentOrders.reduce((sum, paymentOrder) => sum + paymentOrder.value, 0);
            if (totalPaid >= orderValue) {
                throw new AppError_1.AppError(`Pedido ${order.number} já está totalmente pago!`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const newTotalPaid = totalPaid + value;
            // Calcular o troco (somente se o pagamento total exceder o valor do pedido)
            const change = newTotalPaid > orderValue ? newTotalPaid - orderValue : 0;
            console.log('Total pago ate então ' + totalPaid);
            console.log('Novo total pago ' + newTotalPaid);
            console.log('Valor do troco-> ' + change);
            // Registrar o pagamento do pedido
            const payment = yield prisma_1.default.payment.create({
                data: {
                    value,
                    payment_method,
                    table_id: order.table_id,
                    change
                }
            });
            // Criar PaymentOrder para associar o pagamento ao pedido
            yield prisma_1.default.paymentOrder.create({
                data: {
                    payment_id: payment.id,
                    order_id,
                    value
                }
            });
            // Se o pagamento do pedido for quitado, mudar o status para PAID
            if (newTotalPaid >= orderValue && order.status !== PAID) {
                yield prisma_1.default.order.update({
                    where: { id: order_id },
                    data: { status: PAID }
                });
            }
            return {
                data: payment,
                message: `Pagamento registrado para o pedido ${order.number} com sucesso!`
            };
        });
    }
}
exports.PartialPaymentOrderService = PartialPaymentOrderService;
