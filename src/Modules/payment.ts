import mongoose, { Document, Schema } from 'mongoose';



export interface IPayment extends Document {
    bookingid: string;
    from: string;
    to: string;
    perkm_charge:number,
    total_distance:number,
    total_amount:number,
}

const paymentSchema: Schema<IPayment> = new Schema({
    bookingid: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    perkm_charge: { type: Number, required: true},
    total_distance: { type: Number, required: true},
    total_amount: { type: Number, required: true} 
});

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);