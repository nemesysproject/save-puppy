"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const mediator_1 = require("../infrastructure/shared/mediator");
const create_media_command_1 = require("../application/commands/create-media.command");
const delete_media_command_1 = require("../application/commands/delete-media.command");
const get_media_by_pet_query_1 = require("../application/queries/get-media-by-pet.query");
class MediaController {
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
        this.create = async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen' });
                }
                const { petId } = req.body;
                if (!petId) {
                    return res.status(400).json({ error: 'petId es requerido' });
                }
                // 1. Subir imagen a Cloudinary
                // Ahora uploadImage retorna { url, publicId }
                const { url, publicId } = await this.cloudinaryService.uploadImage(req.file.buffer);
                // 2. Persistir metadatos en BD usando CQRS
                const command = new create_media_command_1.CreateMediaCommand(url, publicId, 'CLOUDINARY', // provider
                'IMAGE', // type
                0, // latitude (placeholder, could come from req.body)
                0, // longitude
                petId);
                const result = await mediator_1.mediator.send('CreateMediaCommand', command);
                res.status(201).json(result);
            }
            catch (error) {
                console.error('Error creating media:', error);
                res.status(500).json({ error: 'Error interno al procesar media' });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                const command = new delete_media_command_1.DeleteMediaCommand(id);
                await mediator_1.mediator.send('DeleteMediaCommand', command);
                res.status(200).json({ message: 'Media eliminado correctamente' });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.getByPetId = async (req, res) => {
            try {
                const { petId } = req.params;
                const query = new get_media_by_pet_query_1.GetMediaByPetQuery(petId);
                const result = await mediator_1.mediator.send('GetMediaByPetQuery', query);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }
}
exports.MediaController = MediaController;
