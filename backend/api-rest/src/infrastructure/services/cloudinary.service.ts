import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export class CloudinaryService {
	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
	}

	async uploadImage(
		fileBuffer: Buffer,
		folder: string = "save-puppy",
	): Promise<{ url: string; publicId: string }> {
		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder: folder, resource_type: "image" },
				(error, result) => {
					if (error) return reject(error);
					if (!result) return reject(new Error("Cloudinary upload failed"));
					resolve({ url: result.secure_url, publicId: result.public_id });
				},
			);
			uploadStream.end(fileBuffer);
		});
	}

	async deleteImage(publicId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			cloudinary.uploader.destroy(publicId, (error, result) => {
				if (error) return reject(error);
				resolve();
			});
		});
	}
}
