import { v4 as uuidv4 } from 'uuid';
import { IHandler } from '@/infrastructure/shared/mediator';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { EncryptionService } from '@/infrastructure/services/encryption.service';
import { UserEntity } from '@/domain/entities/user.entity';

export class RegisterUserCommand {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {}
}

export class RegisterUserHandler implements IHandler<RegisterUserCommand, void> {
    constructor(
        private userRepository: IUserRepository,
        private encryptionService: EncryptionService
    ) {}

    async handle(command: RegisterUserCommand): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(command.email);
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }

        const hashedPassword = await this.encryptionService.hash(command.password);

        const newUser = new UserEntity(
            uuidv4(),
            command.email,
            'ADOPTER', // Rol por defecto
            'LOCAL',
            hashedPassword,
            null
        );

        await this.userRepository.save(newUser);
    }
}