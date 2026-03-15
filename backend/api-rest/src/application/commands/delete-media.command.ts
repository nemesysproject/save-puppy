import type { IMediaRepository } from "@/domain/repositories/media.repository";
import type { CloudinaryService } from "@/infrastructure/services/cloudinary.service";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class DeleteMediaCommand {
	constructor(public readonly id: string) {}
}

export class DeleteMediaHandler implements IHandler<DeleteMediaCommand, void> {
	constructor(
		private mediaRepository: IMediaRepository,
		private cloudinaryService: CloudinaryService,
	) {}

	async handle(command: DeleteMediaCommand): Promise<void> {
		const media = await this.mediaRepository.findById(command.id);

		if (media && media.storageKey) {
			try {
				// Eliminate from Cloudinary first
				await this.cloudinaryService.deleteImage(media.storageKey);
			} catch (error) {
				console.error(`Error deleting image from Cloudinary: ${error}`);
				// Continue to delete from DB even if cloud delete fails, to maintain consistency?
				// Or maybe throw? Better log and continue to avoid zombie records in DB.
			}
		}

		await this.mediaRepository.delete(command.id);
	}
}
