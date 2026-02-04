"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
class UploadController {
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
        this.upload = async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen' });
                }
                const { url } = await this.cloudinaryService.uploadImage(req.file.buffer);
                res.status(201).json({
                    message: 'Imagen subida exitosamente',
                    url: url
                });
            }
            catch (error) {
                console.error('Error uploading image:', error);
                res.status(500).json({ error: 'Error al subir la imagen' });
            }
        };
    }
}
exports.UploadController = UploadController;
