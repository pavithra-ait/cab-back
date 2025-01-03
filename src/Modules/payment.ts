import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    paymentIntentId: { type: String, required: true, unique: true },
    bookingid: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
  });
  
  const Payment = mongoose.model('Payment', paymentSchema);

  export default Payment;