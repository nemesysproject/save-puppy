"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetEntity = void 0;
// Entidad pura de negocio
class PetEntity {
    constructor(id, name, status, kindId, genderId, shelterId, ownerEmail) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.kindId = kindId;
        this.genderId = genderId;
        this.shelterId = shelterId;
        this.ownerEmail = ownerEmail;
    }
}
exports.PetEntity = PetEntity;
