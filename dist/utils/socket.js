"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitSocketEvent = void 0;
const server_1 = require("../server");
function emitSocketEvent(event, payload) {
    if (server_1.io) {
        server_1.io.emit(event, payload);
    }
}
exports.emitSocketEvent = emitSocketEvent;
