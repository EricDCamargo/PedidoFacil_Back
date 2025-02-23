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
exports.DeleteTableService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const types_1 = require("../../@types/types");
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteTableService {
    execute({ table_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o ID da mesa foi fornecido
            if (!table_id) {
                throw new AppError_1.AppError('Necessário informar o ID da mesa!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Buscar mesa com seus pedidos e pagamentos associados
            const table = yield prisma_1.default.table.findUnique({
                where: { id: table_id },
                include: {
                    orders: {
                        include: {
                            paymentOrders: {
                                include: {
                                    payment: true // Incluir pagamentos associados ao pedido
                                }
                            }
                        }
                    }
                }
            });
            // Se a mesa não existir
            if (!table) {
                throw new AppError_1.AppError('Mesa não encontrada!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            // Verificar se há pedidos com pagamentos pendentes ou em andamento
            const hasActiveOrders = table.orders.some(order => {
                // Verificar se o pedido está em andamento ou se há pagamentos pendentes
                const orderHasPendingPayments = order.paymentOrders.some(paymentOrder => {
                    return paymentOrder.payment && paymentOrder.payment.change !== null;
                });
                return order.status !== types_1.OrderStatus.CLOSED || orderHasPendingPayments;
            });
            // Obter números dos pedidos ativos
            const handleActiveOrders = () => {
                const activeOrders = table.orders.filter(order => {
                    const orderHasPendingPayments = order.paymentOrders.some(paymentOrder => {
                        return paymentOrder.payment && paymentOrder.payment.change !== null;
                    });
                    return order.status !== types_1.OrderStatus.CLOSED || orderHasPendingPayments;
                });
                return activeOrders.map(order => order.number).join(', ');
            };
            // Se houver pedidos pendentes ou pagamentos incompletos, lançar erro
            if (hasActiveOrders) {
                throw new AppError_1.AppError(`A mesa não pode ser excluída porque possui pedidos em aberto ou pagamentos pendentes: ${handleActiveOrders()}`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Excluir mesa, pois não há pedidos pendentes
            yield prisma_1.default.table.delete({
                where: { id: table_id }
            });
            return { data: undefined, message: 'Mesa excluída com sucesso!' };
        });
    }
}
exports.DeleteTableService = DeleteTableService;
