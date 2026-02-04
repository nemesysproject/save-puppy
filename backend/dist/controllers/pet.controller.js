"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetController = void 0;
const mediator_1 = require("../infrastructure/shared/mediator");
const create_pet_command_1 = require("../application/commands/create-pet.command");
const update_pet_command_1 = require("../application/commands/update-pet.command");
const delete_pet_command_1 = require("../application/commands/delete-pet.command");
const get_pets_query_1 = require("../application/queries/get-pets.query");
const get_pet_by_id_query_1 = require("../application/queries/get-pet-by-id.query");
class PetController {
    async create(req, res) {
        try {
            const { name, status, kindId, genderId, shelterId, ownerEmail } = req.body;
            const command = new create_pet_command_1.CreatePetCommand(name, status, kindId, genderId, shelterId, ownerEmail);
            const result = await mediator_1.mediator.send('CreatePetCommand', command);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, status, kindId, genderId, shelterId, ownerEmail } = req.body;
            const command = new update_pet_command_1.UpdatePetCommand(id, name, status, kindId, genderId, shelterId, ownerEmail);
            const result = await mediator_1.mediator.send('UpdatePetCommand', command);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const command = new delete_pet_command_1.DeletePetCommand(id);
            await mediator_1.mediator.send('DeletePetCommand', command);
            res.status(200).json({ message: 'Mascota eliminada correctamente' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const query = new get_pets_query_1.GetPetsQuery();
            const result = await mediator_1.mediator.send('GetPetsQuery', query);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const query = new get_pet_by_id_query_1.GetPetByIdQuery(id);
            const result = await mediator_1.mediator.send('GetPetByIdQuery', query);
            if (!result) {
                return res.status(404).json({ error: 'Mascota no encontrada' });
            }
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.PetController = PetController;
