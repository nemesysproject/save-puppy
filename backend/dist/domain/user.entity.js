"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(id, email, role, provider, password, providerId) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.password = password;
        this.providerId = providerId;
    }
}
exports.UserEntity = UserEntity;
