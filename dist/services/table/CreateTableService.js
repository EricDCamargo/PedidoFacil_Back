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
exports.CreateTableService = void 0;
const http_status_codes_1 = require("http-status-codes");
const types_1 = require("../../@types/types");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class CreateTableService {
    execute({ number }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { AVAILABLE } = types_1.TableStatus;
            if (!number) {
                throw new AppError_1.AppError('Necessario informar numero da mesa!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const tableExists = yield prisma_1.default.table.findUnique({
                where: { number }
            });
            if (tableExists) {
                throw new AppError_1.AppError('Mesa ja existe!', http_status_codes_1.StatusCodes.CONFLICT);
            }
            const table = yield prisma_1.default.table.create({
                data: {
                    number,
                    status: AVAILABLE
                }
            });
            return { data: table, message: 'Mesa criada com sucesso!' };
        });
    }
}
exports.CreateTableService = CreateTableService;
