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
exports.logMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const server_1 = require("../server");
const socket_1 = require("../@types/socket");
function logMiddleware(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.method === 'GET') {
                return next();
            }
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            let user_id = null;
            if (token) {
                const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
                user_id = decodedToken.sub;
            }
            const details = JSON.stringify({
                params: req.params,
                body: req.body
            });
            yield prisma_1.default.log.create({
                data: {
                    user_id,
                    route: req.path,
                    method: req.method,
                    details
                }
            });
            yield server_1.io.emit(socket_1.SocketEvents.LOG_CREATED);
        }
        catch (error) {
            console.error('Erro ao registrar log:', error);
        }
        next();
    });
}
exports.logMiddleware = logMiddleware;
