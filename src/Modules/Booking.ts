// models/Booking.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IBooking extends Document {
    amount: number;
    currency: string;
    pickupLocation: string;
    dropoffLocation: string;
    paymentIntentId: string;
    status: string;
}

const BookingSchema: Schema = new Schema({
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    status: { type: String, default: 'pending' },  // e.g., 'pending', 'completed'
});

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

