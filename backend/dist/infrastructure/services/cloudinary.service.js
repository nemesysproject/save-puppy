"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
    async uploadImage(fileBuffer, folder = 'save-puppy') {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: folder, resource_type: 'image' }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result)
                    return reject(new Error('Cloudinary upload failed'));
                resolve({ url: result.secure_url, publicId: result.public_id });
            });
            uploadStream.end(fileBuffer);
        });
    }
    async deleteImage(publicId) {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    }
}
exports.CloudinaryService = CloudinaryService;
