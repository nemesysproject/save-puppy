import { Request, Response } from 'express';
import { mediator } from '@/infrastructure/shared/mediator';
import { CloudinaryService } from '@/infrastructure/services/cloudinary.service';
import { CreateMediaCommand } from '@/application/commands/create-media.command';
import { DeleteMediaCommand } from '@/application/commands/delete-media.command';
import { GetMediaByPetQuery } from '@/application/queries/get-media-by-pet.query';

export class MediaController {
    constructor(private cloudinaryService: CloudinaryService) { }

    create = async (req: Request, res: Response) => {
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
            const command = new CreateMediaCommand(
                url,
                publicId,
                'CLOUDINARY', // provider
                'IMAGE',      // type
                0,            // latitude (placeholder, could come from req.body)
                0,            // longitude
                petId
            );

            const result = await mediator.send('CreateMediaCommand', command);
            res.status(201).json(result);

        } catch (error: any) {
            console.error('Error creating media:', error);
            res.status(500).json({ error: 'Error interno al procesar media' });
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const command = new DeleteMediaCommand(id);
            await mediator.send('DeleteMediaCommand', command);
            res.status(200).json({ message: 'Media eliminado correctamente' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    getByPetId = async (req: Request, res: Response) => {
        try {
            const { petId } = req.params;
            const query = new GetMediaByPetQuery(petId);
            const result = await mediator.send('GetMediaByPetQuery', query);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
