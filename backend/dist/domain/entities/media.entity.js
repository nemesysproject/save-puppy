"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaEntity = void 0;
class MediaEntity {
    constructor(id, url, storageKey, provider, type, latitude, longitude, petId, createdAt, updatedAt) {
        this.id = id;
        this.url = url;
        this.storageKey = storageKey;
        this.provider = provider;
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.petId = petId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.MediaEntity = MediaEntity;
