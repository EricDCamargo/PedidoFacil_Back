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
exports.PrinterService = void 0;
const node_thermal_printer_1 = require("node-thermal-printer");
const prisma_1 = __importDefault(require("../../prisma"));
class PrinterService {
    constructor() {
        this.printer = new node_thermal_printer_1.ThermalPrinter({
            type: node_thermal_printer_1.PrinterTypes.EPSON,
            interface: 'usb' // Interface da impressora
        });
    }
    printPaidOrders(paidOrders) {
        return __awaiter(this, void 0, void 0, function* () {
            const { number } = yield prisma_1.default.table.findUnique({
                where: { id: paidOrders[0].table_id },
                select: { number: true }
            });
            // Cabeçalho
            this.printer.println('Comprovante de Pagamento');
            this.printer.println(`Mesa: ${number}`);
            this.printer.println(`Data: ${new Date().toLocaleString()}`);
            this.printer.drawLine();
            // Detalhes dos pedidos pagos
            for (const order of paidOrders) {
                this.printer.println(`Pedido #${order.number}`);
                for (const item of order.items) {
                    this.printer.println(`  ${item.amount}x ${item.product.name} - R$${item.total_value.toFixed(2)}`);
                }
                this.printer.println(`Total do Pedido: R$${order.total.toFixed(2)}`);
                this.printer.drawLine();
            }
            // Finalizar e cortar o comprovante
            this.printer.cut();
            // Tentar imprimir
            const isPrinted = yield this.printer.execute();
            if (!isPrinted) {
                throw new Error('Erro ao imprimir o comprovante.');
            }
        });
    }
    printKitchenOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const { number } = yield prisma_1.default.table.findUnique({
                where: { id: order.table_id },
                select: { number: true }
            });
            // Cabeçalho
            this.printer.println('Pedido para Cozinha');
            this.printer.println(`Pedido #${order.number}`);
            this.printer.println(`Mesa: ${number}`);
            this.printer.println(`Data: ${new Date().toLocaleString()}`);
            this.printer.drawLine();
            // Detalhes dos itens do pedido
            for (const item of order.items) {
                this.printer.println(`${item.amount}x ${item.product.name} - R$${item.unit_value.toFixed(2)}`);
                if (item.observation) {
                    this.printer.println(`  Observação: ${item.observation}`);
                }
            }
            this.printer.drawLine();
            this.printer.println('Por favor, preparar com atenção!');
            this.printer.cut();
            // Tentar imprimir
            const isPrinted = yield this.printer.execute();
            if (!isPrinted) {
                throw new Error('Erro ao imprimir o pedido na cozinha.');
            }
        });
    }
    testPrintPaidOrders(paidOrders) {
        return __awaiter(this, void 0, void 0, function* () {
            const { number } = yield prisma_1.default.table.findUnique({
                where: { id: paidOrders[0].table_id },
                select: { number: true }
            });
            console.log('--- Comprovante de Pagamento ---');
            console.log(`Mesa: ${number}`);
            console.log(`Data: ${new Date().toLocaleString()}`);
            console.log('-------------------------------');
            for (const order of paidOrders) {
                console.log(`Pedido #${order.number}`);
                for (const item of order.items) {
                    console.log(`  ${item.amount}x ${item.product.name} - R$${item.total_value.toFixed(2)}`);
                }
                console.log(`Total do Pedido: R$${order.total.toFixed(2)}`);
                console.log('-------------------------------');
            }
        });
    }
    testPrintKitchenOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const { number } = yield prisma_1.default.table.findUnique({
                where: { id: order.table_id },
                select: { number: true }
            });
            console.log('--- Pedido para Cozinha ---');
            console.log(`Pedido #${order.number}`);
            console.log(`Mesa: ${number}`);
            console.log(`Data: ${new Date().toLocaleString()}`);
            console.log('---------------------------');
            for (const item of order.items) {
                console.log(`${item.amount}x ${item.product.name} - R$${item.unit_value.toFixed(2)}`);
                if (item.observation) {
                    console.log(`  Observação: ${item.observation}`);
                }
            }
            console.log('---------------------------');
            console.log('Por favor, preparar com atenção!');
        });
    }
}
exports.PrinterService = PrinterService;
