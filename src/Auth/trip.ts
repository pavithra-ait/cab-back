import { Request, Response } from 'express';
import Booking from '../Modules/Booking';
import Trip from '../Modules/Trip';

// Mock payment function
const processPayment = (totalAmount: number): boolean => {
  return totalAmount > 0;
};
const completeTrip = async (req: Request, res: Response) => {
  const { userid, totalAmount } = req.body;

  try {
    const booking = await Booking.findOne({userid, status: 'pending' });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already completed.' });
    }

    const driver = await Booking.findById(booking.taxiid);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    const paymentSuccessful = processPayment(totalAmount);
    if (!paymentSuccessful) {
      return res.status(400).json({ message: 'Payment failed.' });
    }


    const trip = new Trip({
      bookingid: booking._id,
      taxiid: booking.taxiid,
      userid: booking.userid,
      totalAmount: totalAmount,
    });
    await trip.save();

    booking.status = 'Completed';
    await booking.save();

    trip.paymentStatus = 'paid';
    // trip.completedAt = new Date();
    await trip.save();

    return res.status(200).send({
      message: 'Trip completed successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};  

export default completeTrip;
