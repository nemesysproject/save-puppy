"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShelterController = void 0;
const mediator_1 = require("../infrastructure/shared/mediator");
const create_shelter_command_1 = require("../application/commands/create-shelter.command");
const update_shelter_command_1 = require("../application/commands/update-shelter.command");
const delete_shelter_command_1 = require("../application/commands/delete-shelter.command");
const get_shelters_query_1 = require("../application/queries/get-shelters.query");
const get_shelter_by_id_query_1 = require("../application/queries/get-shelter-by-id.query");
class ShelterController {
    async create(req, res) {
        try {
            const { name, email, address, latitude, longitude, capacity } = req.body;
            const command = new create_shelter_command_1.CreateShelterCommand(name, email, address, latitude, longitude, capacity);
            const result = await mediator_1.mediator.send('CreateShelterCommand', command);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, address, latitude, longitude, capacity } = req.body;
            const command = new update_shelter_command_1.UpdateShelterCommand(id, name, email, address, latitude, longitude, capacity);
            const result = await mediator_1.mediator.send('UpdateShelterCommand', command);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const command = new delete_shelter_command_1.DeleteShelterCommand(id);
            await mediator_1.mediator.send('DeleteShelterCommand', command);
            res.status(200).json({ message: 'Refugio eliminado correctamente' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const query = new get_shelters_query_1.GetSheltersQuery();
            const result = await mediator_1.mediator.send('GetSheltersQuery', query);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const query = new get_shelter_by_id_query_1.GetShelterByIdQuery(id);
            const result = await mediator_1.mediator.send('GetShelterByIdQuery', query);
            if (!result) {
                return res.status(404).json({ error: 'Refugio no encontrado' });
            }
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ShelterController = ShelterController;
