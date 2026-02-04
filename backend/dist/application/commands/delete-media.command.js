"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMediaHandler = exports.DeleteMediaCommand = void 0;
class DeleteMediaCommand {
    constructor(id) {
        this.id = id;
    }
}
exports.DeleteMediaCommand = DeleteMediaCommand;
class DeleteMediaHandler {
    constructor(mediaRepository, cloudinaryService) {
        this.mediaRepository = mediaRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async handle(command) {
        const media = await this.mediaRepository.findById(command.id);
        if (media && media.storageKey) {
            try {
                // Eliminate from Cloudinary first
                await this.cloudinaryService.deleteImage(media.storageKey);
            }
            catch (error) {
                console.error(`Error deleting image from Cloudinary: ${error}`);
                // Continue to delete from DB even if cloud delete fails, to maintain consistency? 
                // Or maybe throw? Better log and continue to avoid zombie records in DB.
            }
        }
        await this.mediaRepository.delete(command.id);
    }
}
exports.DeleteMediaHandler = DeleteMediaHandler;
