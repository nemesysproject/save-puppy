"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePetHandler = exports.UpdatePetCommand = void 0;
class UpdatePetCommand {
    constructor(id, name, status, kindId, genderId, shelterId, ownerEmail) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.kindId = kindId;
        this.genderId = genderId;
        this.shelterId = shelterId;
        this.ownerEmail = ownerEmail;
    }
}
exports.UpdatePetCommand = UpdatePetCommand;
class UpdatePetHandler {
    constructor(petRepository) {
        this.petRepository = petRepository;
    }
    async handle(command) {
        const petToUpdate = {};
        if (command.name)
            petToUpdate.name = command.name;
        if (command.status)
            petToUpdate.status = command.status;
        if (command.kindId)
            petToUpdate.kindId = command.kindId;
        if (command.genderId)
            petToUpdate.genderId = command.genderId;
        if (command.shelterId !== undefined)
            petToUpdate.shelterId = command.shelterId;
        if (command.ownerEmail !== undefined)
            petToUpdate.ownerEmail = command.ownerEmail;
        return await this.petRepository.update(command.id, petToUpdate);
    }
}
exports.UpdatePetHandler = UpdatePetHandler;
