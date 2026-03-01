import { Request, Response } from 'express';
import { CloudinaryService } from '@/infrastructure/services/cloudinary.service';

export class UploadController {
    constructor(private cloudinaryService: CloudinaryService) { }

    upload = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen' });
            }

            const { url } = await this.cloudinaryService.uploadImage(req.file.buffer);

            res.status(201).json({
                message: 'Imagen subida exitosamente',
                url: url
            });
        } catch (error: any) {
            console.error('Error uploading image:', error);
            res.status(500).json({ error: 'Error al subir la imagen' });
        }
    }
}
