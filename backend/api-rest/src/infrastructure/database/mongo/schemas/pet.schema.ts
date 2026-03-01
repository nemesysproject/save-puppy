import mongoose, { Schema, Document } from 'mongoose';

export interface IPetDocument extends Document {
    uuid: string; // ID from Postgres
    name: string;
    status: string;
    kindId: string;
    genderId: string;
    shelterId?: string;
    ownerEmail?: string;
    media?: Array<{
        url: string;
        type: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const PetSchema: Schema = new Schema({
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    kindId: { type: String, required: true },
    genderId: { type: String, required: true },
    shelterId: { type: String },
    ownerEmail: { type: String },
    media: [{
        url: String,
        type: String
    }]
}, { timestamps: true });

export const PetModel = mongoose.model<IPetDocument>('Pet', PetSchema);
