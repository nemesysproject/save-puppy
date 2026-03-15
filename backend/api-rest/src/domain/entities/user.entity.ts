export class UserEntity {
	constructor(
		public id: string,
		public email: string,
		public role: string,
		public provider: string,
		public password?: string | null,
		public providerId?: string | null,
	) {}
}
