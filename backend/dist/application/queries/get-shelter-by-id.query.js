"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetShelterByIdHandler = exports.GetShelterByIdQuery = void 0;
class GetShelterByIdQuery {
    constructor(id) {
        this.id = id;
    }
}
exports.GetShelterByIdQuery = GetShelterByIdQuery;
class GetShelterByIdHandler {
    constructor(shelterRepository) {
        this.shelterRepository = shelterRepository;
    }
    async handle(query) {
        return await this.shelterRepository.findById(query.id);
    }
}
exports.GetShelterByIdHandler = GetShelterByIdHandler;
