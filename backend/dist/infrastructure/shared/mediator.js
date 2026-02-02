"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediator = exports.Mediator = void 0;
class Mediator {
    constructor() {
        this.handlers = new Map();
    }
    register(key, handler) {
        this.handlers.set(key, handler);
    }
    async send(key, payload) {
        const handler = this.handlers.get(key);
        if (!handler) {
            throw new Error(`No handler registered for ${key}`);
        }
        return handler.handle(payload);
    }
}
exports.Mediator = Mediator;
exports.mediator = new Mediator();
