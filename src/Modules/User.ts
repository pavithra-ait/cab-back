import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    city: string;
    mobile: number;
    gender: string;
    address: string;
}

const userSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: Number, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true }
});

export const User = mongoose.model<IUser>('User', userSchema);


