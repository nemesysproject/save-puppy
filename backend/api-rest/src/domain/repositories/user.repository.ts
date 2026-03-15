import type { UserEntity } from "@/domain/entities/user.entity";

export interface IUserRepository {
	save(user: UserEntity): Promise<void>;
	findByEmail(email: string): Promise<UserEntity | null>;
}
