"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSheltersHandler = exports.GetSheltersQuery = void 0;
class GetSheltersQuery {
}
exports.GetSheltersQuery = GetSheltersQuery;
class GetSheltersHandler {
    constructor(shelterRepository) {
        this.shelterRepository = shelterRepository;
    }
    async handle(query) {
        return await this.shelterRepository.findAll();
    }
}
exports.GetSheltersHandler = GetSheltersHandler;
