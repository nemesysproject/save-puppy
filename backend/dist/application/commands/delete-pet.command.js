"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePetHandler = exports.DeletePetCommand = void 0;
class DeletePetCommand {
    constructor(id) {
        this.id = id;
    }
}
exports.DeletePetCommand = DeletePetCommand;
class DeletePetHandler {
    constructor(petRepository) {
        this.petRepository = petRepository;
    }
    async handle(command) {
        await this.petRepository.delete(command.id);
    }
}
exports.DeletePetHandler = DeletePetHandler;
