"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserHandler = exports.RegisterUserCommand = void 0;
const uuid_1 = require("uuid");
const user_entity_1 = require("../../domain/entities/user.entity");
class RegisterUserCommand {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.RegisterUserCommand = RegisterUserCommand;
class RegisterUserHandler {
    constructor(userRepository, encryptionService) {
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
    }
    async handle(command) {
        const existingUser = await this.userRepository.findByEmail(command.email);
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }
        const hashedPassword = await this.encryptionService.hash(command.password);
        const newUser = new user_entity_1.UserEntity((0, uuid_1.v4)(), command.email, 'ADOPTER', // Rol por defecto
        'LOCAL', hashedPassword, null);
        await this.userRepository.save(newUser);
    }
}
exports.RegisterUserHandler = RegisterUserHandler;
