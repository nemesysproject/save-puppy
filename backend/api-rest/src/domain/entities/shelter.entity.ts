export class ShelterEntity {
	constructor(
		public id: string,
		public name: string,
		public email: string,
		public address?: string | null,
		public latitude?: number | null,
		public longitude?: number | null,
		public capacity?: number | null,
	) {}
}
