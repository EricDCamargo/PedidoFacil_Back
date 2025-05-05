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
exports.CreateUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const AppError_1 = require("../../errors/AppError");
const http_status_codes_1 = require("http-status-codes");
const types_1 = require("../../@types/types");
class CreateUserService {
    execute({ name, email, password, role }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !password || !name) {
                throw new AppError_1.AppError('Nome email e senha são necessarios!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const userAlreadyExists = yield prisma_1.default.user.findUnique({
                where: { email }
            });
            if (userAlreadyExists) {
                throw new AppError_1.AppError('Email já cadastrado em outro usuario!', http_status_codes_1.StatusCodes.CONFLICT);
            }
            const passwordHash = yield (0, bcryptjs_1.hash)(password, 8);
            try {
                const user = yield prisma_1.default.user.create({
                    data: {
                        name,
                        email,
                        password: passwordHash,
                        role: role || types_1.Role.USER
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                });
                return { data: user, message: 'Usuario criado com sucesso!' };
            }
            catch (error) {
                throw new AppError_1.AppError('Erro ao criar usuario!', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.CreateUserService = CreateUserService;
