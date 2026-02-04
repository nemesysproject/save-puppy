"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPetsHandler = exports.GetPetsQuery = void 0;
class GetPetsQuery {
}
exports.GetPetsQuery = GetPetsQuery;
class GetPetsHandler {
    constructor(petRepository) {
        this.petRepository = petRepository;
    }
    async handle(query) {
        return await this.petRepository.findAll();
    }
}
exports.GetPetsHandler = GetPetsHandler;
