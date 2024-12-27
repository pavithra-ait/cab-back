import mongoose, { Document, Schema } from 'mongoose';


export interface IBooking extends Document {
    taxiid: string;
    userid: string;
    from: string;
    to: string;
    pickup_time: string;
    booking_date: Date;
    status: "Pending" | "Completed" | "Cancelled";
}

const BookingSchema: Schema<IBooking> = new Schema({
    taxiid: { type: String, required: true },
    userid: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    booking_date: { type: Date, required: true },
    pickup_time: { type: String, required: true }, // Change to String
    status: { type: String, default: "Pending" },
});
const Booking  = mongoose.model<IBooking>('Booking', BookingSchema)
export default Booking;

