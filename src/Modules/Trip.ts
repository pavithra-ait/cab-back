import { Schema, model, Document } from 'mongoose';

export interface ITrip extends Document {
  bookingid: string;
  taxiid: string;
  userid: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid';
  completedAt: Date | null;
}

const tripSchema = new Schema<ITrip>({
  bookingid: { type: String, required: true },
  taxiid: { type: String, required: true },
  userid: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'pending' },
  completedAt: { type: Date, default: null },
});

const Trip = model<ITrip>('Trip', tripSchema);

export default Trip;