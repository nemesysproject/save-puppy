import mongoose, { type Document, Schema } from "mongoose";

export interface IShelterDocument extends Document {
	uuid: string; // ID from Postgres
	name: string;
	email: string;
	address?: string;
	latitude?: number;
	longitude?: number;
	capacity?: number;
	createdAt: Date;
	updatedAt: Date;
}

const ShelterSchema: Schema = new Schema(
	{
		uuid: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		email: { type: String, required: true },
		address: { type: String },
		latitude: { type: Number },
		longitude: { type: Number },
		capacity: { type: Number },
	},
	{ timestamps: true },
);

export const ShelterModel = mongoose.model<IShelterDocument>(
	"Shelter",
	ShelterSchema,
);
