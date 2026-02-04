"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMediaByPetHandler = exports.GetMediaByPetQuery = void 0;
class GetMediaByPetQuery {
    constructor(petId) {
        this.petId = petId;
    }
}
exports.GetMediaByPetQuery = GetMediaByPetQuery;
class GetMediaByPetHandler {
    constructor(mediaRepository) {
        this.mediaRepository = mediaRepository;
    }
    async handle(query) {
        return await this.mediaRepository.findByPetId(query.petId);
    }
}
exports.GetMediaByPetHandler = GetMediaByPetHandler;
