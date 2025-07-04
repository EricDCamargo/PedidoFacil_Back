"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const http_status_codes_1 = require("http-status-codes");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
//Default middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 }
}));
app.use(routes_1.router);
app.use('/files', express_1.default.static(path_1.default.resolve(__dirname, '..', 'tmp')));
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            error: err.message
        });
    }
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        messege: 'Internal server error'
    });
});
let io;
if (process.env.USE_SOCKET === 'true') {
    const server = http_1.default.createServer(app);
    exports.io = io = new socket_io_1.Server(server);
    io.on('connection', socket => {
        console.log('Novo cliente conectado:', socket.id);
    });
    server.listen(process.env.PORT || 3333, () => {
        console.log('Server online com socket!');
    });
}
exports.default = app;
