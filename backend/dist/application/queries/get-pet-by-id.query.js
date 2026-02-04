"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPetByIdHandler = exports.GetPetByIdQuery = void 0;
class GetPetByIdQuery {
    constructor(id) {
        this.id = id;
    }
}
exports.GetPetByIdQuery = GetPetByIdQuery;
class GetPetByIdHandler {
    constructor(petRepository) {
        this.petRepository = petRepository;
    }
    async handle(query) {
        return await this.petRepository.findById(query.id);
    }
}
exports.GetPetByIdHandler = GetPetByIdHandler;
