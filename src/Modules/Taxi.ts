import { IDriver } from "./Driver";
import mongoose, { Document, Schema } from 'mongoose';

export interface ITaxi extends Document {
    taxiimage: string;
    taxiname: string;
    taxibrand: string;
    driverid: IDriver['_id'];
    drivername: string;
    from: string;
    to: string;
    available: boolean
}

const taxiSchema: Schema<ITaxi> = new Schema({
    taxiimage: { type: String, required: true },
    taxiname: { type: String, required: true },
    taxibrand: { type: String, required: true },
    driverid: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    drivername: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    available: { type: Boolean, required: true ,default: true, }
});

export const Taxi = mongoose.model<ITaxi>('Taxi', taxiSchema);
