import { IHandler } from '@/infrastructure/shared/mediator';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { EncryptionService } from '@/infrastructure/services/encryption.service';
import { TokenService } from '@/infrastructure/services/token.service';

export class LoginUserCommand {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {}
}

export class LoginUserHandler implements IHandler<LoginUserCommand, { token: string }> {
    constructor(
        private userRepository: IUserRepository,
        private encryptionService: EncryptionService,
        private tokenService: TokenService
    ) {}

    async handle(command: LoginUserCommand): Promise<{ token: string }> {
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