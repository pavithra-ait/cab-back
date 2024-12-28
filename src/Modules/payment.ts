import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingid: { type: String },
  paymentIntentId: String,
  amount: Number,
  currency: String,
  status: { type: String, default: 'pending' },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
