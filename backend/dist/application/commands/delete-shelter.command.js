"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteShelterHandler = exports.DeleteShelterCommand = void 0;
class DeleteShelterCommand {
    constructor(id) {
        this.id = id;
    }
}
exports.DeleteShelterCommand = DeleteShelterCommand;
class DeleteShelterHandler {
    constructor(shelterRepository) {
        this.shelterRepository = shelterRepository;
    }
    async handle(command) {
        await this.shelterRepository.delete(command.id);
    }
}
exports.DeleteShelterHandler = DeleteShelterHandler;
