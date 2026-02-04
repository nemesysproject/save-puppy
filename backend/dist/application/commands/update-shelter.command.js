"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShelterHandler = exports.UpdateShelterCommand = void 0;
class UpdateShelterCommand {
    constructor(id, name, email, address, latitude, longitude, capacity) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.capacity = capacity;
    }
}
exports.UpdateShelterCommand = UpdateShelterCommand;
class UpdateShelterHandler {
    constructor(shelterRepository) {
        this.shelterRepository = shelterRepository;
    }
    async handle(command) {
        const shelterToUpdate = {};
        if (command.name)
            shelterToUpdate.name = command.name;
        if (command.email)
            shelterToUpdate.email = command.email;
        if (command.address)
            shelterToUpdate.address = command.address;
        if (command.latitude)
            shelterToUpdate.latitude = command.latitude;
        if (command.longitude)
            shelterToUpdate.longitude = command.longitude;
        if (command.capacity)
            shelterToUpdate.capacity = command.capacity;
        return await this.shelterRepository.update(command.id, shelterToUpdate);
    }
}
exports.UpdateShelterHandler = UpdateShelterHandler;
