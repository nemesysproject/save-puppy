"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKindsHandler = exports.GetKindsQuery = void 0;
class GetKindsQuery {
}
exports.GetKindsQuery = GetKindsQuery;
class GetKindsHandler {
    constructor(kindRepository) {
        this.kindRepository = kindRepository;
    }
    async handle(query) {
        return await this.kindRepository.findAll();
    }
}
exports.GetKindsHandler = GetKindsHandler;
