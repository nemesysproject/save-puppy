export class MediaEntity {
    constructor(
        public id: string,
        public url: string,
        public storageKey: string | null,
        public provider: string | null,
        public type: string,
        public latitude: number | null,
        public longitude: number | null,
        public petId: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ) { }
}
