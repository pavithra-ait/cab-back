import express, { Request, Response } from 'express';
import PaymentController from '../Auth/paymentauth';
import { Payment } from '../Modules/payment';
import  Booking  from '../Modules/Booking';
const router = express.Router();


router.get('/find', PaymentController.getdata);


router.post('/create', async (req: Request, res: Response) => {
    await PaymentController.createdata(req, res);

});


router.get('/find/:_id', PaymentController.indexdata);
router.delete('/remove/:id', PaymentController.deletedata);

router.put('/update/:id', async (req: Request, res: Response): Promise<void> => {

    try {
        const { bookingid,perkm_charge} = req.body;

        const payment = await Payment.findById(bookingid);
        if (!payment) {
            res.status(404).json({ error: "payment not found" });
            return;
        }


        if (!bookingid) {
            res.status(400).json({ error: 'booking ID is required.' });
            return;
        }

        const book = await Booking.findById(bookingid);

        if (!book) {
            res.status(404).json({ error: 'book not found.' });
            return;
        }

        const distance = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
        const total = distance * perkm_charge


        payment.bookingid = bookingid;
        payment.from = book.from;
        payment.to = book.to;
        payment.total_distance = distance;
        payment.total_amount = total;
        await payment.save();
        res.status(200).json({ message: "payment updated successfully", payment });
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;