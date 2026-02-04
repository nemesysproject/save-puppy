"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGendersHandler = exports.GetGendersQuery = void 0;
class GetGendersQuery {
}
exports.GetGendersQuery = GetGendersQuery;
class GetGendersHandler {
    constructor(genderRepository) {
        this.genderRepository = genderRepository;
        console.log('GetGendersHandler initialized with GenderRepository');
    }
    async handle(query) {
        return await this.genderRepository.findAll();
    }
}
exports.GetGendersHandler = GetGendersHandler;
