"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserHandler = exports.LoginUserCommand = void 0;
class LoginUserCommand {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.LoginUserCommand = LoginUserCommand;
class LoginUserHandler {
    constructor(userRepository, encryptionService, tokenService) {
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.tokenService = tokenService;
    }
    async handle(command) {
        const user = await this.userRepository.findByEmail(command.email);
        if (!user || !user.password) {
            throw new Error('Credenciales inválidas');
        }
        const isValid = await this.encryptionService.compare(command.password, user.password);
        if (!isValid) {
            throw new Error('Credenciales inválidas');
        }
        const token = this.tokenService.sign({
            id: user.id,
            email: user.email,
            role: user.role
        });
        return { token };
    }
}
exports.LoginUserHandler = LoginUserHandler;
