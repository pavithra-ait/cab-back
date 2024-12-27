import mongoose, { Document, Schema } from 'mongoose';

// driver schema

export interface IDriver extends Document {
    name: string;
    email: string;
    password: string;
    city: string;
    mobile: number;
    gender: string;
    address: string;
    licence:number
}

const driverSchema: Schema<IDriver> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: Number, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    licence: { type: Number, required: true }

});

export const Driver = mongoose.model<IDriver>('Driver', driverSchema);