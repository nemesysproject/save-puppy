// Entidad pura de negocio
export class PetEntity {
	constructor(
		public id: string,
		public name: string,
		public status: string,
		public kindId: string,
		public genderId: string,
		public shelterId?: string | null,
		public ownerEmail?: string,
	) {}
}
