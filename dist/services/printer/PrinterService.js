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
const AppError_1 = require("../../errors/AppError");
const http_status_codes_1 = require("http-status-codes");
const serialport_1 = require("serialport");
const statusPt = {
    DRAFT: 'Rascunho',
    IN_PROGRESS: 'Em preparo',
    COMPLETED: 'Finalizado',
    PAID: 'Pago',
    CLOSED: 'Fechado'
};
class PrinterService {
    constructor() {
        this.printerInterface = process.env.PRINTER_INTERFACE;
    }
    static checkSerialPort() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const baudRate of [115200]) {
                try {
                    const port = new serialport_1.SerialPort({
                        path: process.env.PRINTER_INTERFACE,
                        baudRate,
                        autoOpen: false
                    });
                    yield new Promise((resolve, reject) => {
                        port.open(err => (err ? reject(err) : resolve()));
                    });
                    port.close();
                    return true;
                }
                catch (err) {
                    console.warn(`Falha ao testar porta serial em ${baudRate}:`, err);
                }
            }
            return false;
        });
    }
    checkPortConection() {
        return __awaiter(this, void 0, void 0, function* () {
            const portOk = yield PrinterService.checkSerialPort();
            if (!portOk) {
                throw new AppError_1.AppError('Impressora não conectada ou porta inacessível.', http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE);
            }
        });
    }
    initializePrinter() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkPortConection();
            return new node_thermal_printer_1.ThermalPrinter({
                type: node_thermal_printer_1.PrinterTypes.DARUMA,
                interface: this.printerInterface,
                characterSet: node_thermal_printer_1.CharacterSet.PC860_PORTUGUESE,
                removeSpecialCharacters: false,
                lineCharacter: '=',
                breakLine: node_thermal_printer_1.BreakLine.WORD,
                options: {
                    timeout: 5000
                }
            });
        });
    }
    printPaidOrders(paidOrders) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const printer = yield this.initializePrinter();
                const { number } = yield prisma_1.default.table.findUnique({
                    where: { id: paidOrders[0].table_id },
                    select: { number: true }
                });
                printer.alignCenter();
                printer.println('*** COMPROVANTE DE PAGAMENTO ***');
                printer.println(`Mesa: ${number}`);
                printer.println(`Data: ${new Date().toLocaleString()}`);
                printer.drawLine();
                let globalIndex = 1;
                let totalGeral = 0;
                for (const order of paidOrders) {
                    printer.println(`Pedido #${order.number}`);
                    printer.println('-------------------------------------------');
                    printer.println('Item  Produto         Qtd  V.Unit   V.Total');
                    printer.println('-------------------------------------------');
                    let totalPedido = 0;
                    for (const item of order.items) {
                        const nome = (item.product.name || '').padEnd(14).substring(0, 14);
                        const qtd = String(item.amount).padStart(3);
                        const vUnit = `R$${item.unit_value.toFixed(2)}`.padStart(7);
                        const vTotal = `R$${item.total_value.toFixed(2)}`.padStart(8);
                        printer.println(`${globalIndex
                            .toString()
                            .padEnd(4)} ${nome}${qtd} ${vUnit} ${vTotal}`);
                        totalPedido += item.total_value;
                        globalIndex++;
                    }
                    printer.println('-------------------------------------------');
                    printer.println(`Total do Pedido: R$${totalPedido.toFixed(2)}`);
                    printer.drawLine();
                    totalGeral += totalPedido;
                }
                printer.println(`TOTAL GERAL: R$${totalGeral.toFixed(2)}`);
                printer.drawLine();
                printer.newLine();
                printer.cut();
                const isPrinted = yield printer.execute();
                if (!isPrinted) {
                    throw new AppError_1.AppError('Erro ao imprimir o comprovante.');
                }
                return {
                    message: 'Comprovante impresso com sucesso!'
                };
            }
            catch (err) {
                const msg = err instanceof AppError_1.AppError ? err.message : 'Erro ao imprimir.';
                throw new AppError_1.AppError(msg);
            }
        });
    }
    printKitchenOrder(order_id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const printer = yield this.initializePrinter();
                const order = yield prisma_1.default.order.findUnique({
                    where: { id: order_id },
                    include: {
                        items: {
                            include: {
                                product: { select: { name: true } }
                            }
                        },
                        table: {
                            select: { number: true }
                        }
                    }
                });
                printer.alignCenter();
                printer.setTextDoubleHeight();
                printer.println('*** COZINHA ***');
                printer.drawLine();
                printer.alignLeft();
                printer.println(`PEDIDO: #${order.number}`);
                printer.println(`MESA: ${order.table.number}`);
                printer.println(`CLIENTE: ${order.name || '-'}`);
                printer.println(`STATUS: ${statusPt[order.status] || order.status}`);
                printer.println(`DATA: ${new Date(order.created_at).toLocaleString()}`);
                printer.drawLine();
                printer.println('ITENS:');
                for (const item of order.items) {
                    printer.println(`- ${item.amount}x ${item.product.name}`);
                    if ((_a = item.observation) === null || _a === void 0 ? void 0 : _a.trim()) {
                        printer.println(`  Obs: ${item.observation}`);
                    }
                }
                printer.drawLine();
                printer.newLine();
                printer.drawLine();
                printer.cut();
                const isPrinted = yield printer.execute();
                if (!isPrinted) {
                    throw new AppError_1.AppError('Erro ao imprimir o pedido na cozinha.');
                }
                return {
                    message: 'Pedido impresso com sucesso na cozinha!'
                };
            }
            catch (err) {
                const msg = err instanceof AppError_1.AppError ? err.message : 'Erro ao imprimir.';
                throw new AppError_1.AppError(msg);
            }
        });
    }
    testPrinterConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const printer = yield this.initializePrinter();
                printer.alignCenter();
                printer.println('Teste de Conexão');
                printer.newLine();
                printer.drawLine();
                printer.cut();
                const isPrinted = yield printer.execute();
                if (!isPrinted) {
                    throw new AppError_1.AppError('Impressora não conectada ou inacessível.', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                return { message: 'Teste de conexão realizado com sucesso!' };
            }
            catch (err) {
                const msg = err instanceof AppError_1.AppError ? err.message : 'Erro ao imprimir.';
                throw new AppError_1.AppError(msg);
            }
        });
    }
}
exports.PrinterService = PrinterService;
