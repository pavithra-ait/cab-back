import express, { Request, Response } from 'express';
import BookingController from '../Auth/Bookingauth';
import Booking from '../Modules/Booking';

const router = express.Router();

router.get('/find', BookingController.getdata);
router.post('/create', async (req: Request, res: Response) => {
    await BookingController.createdata(req, res);
});

router.get('/find/:_id', BookingController.indexdata);
router.delete('/remove/:id', BookingController.deletedata);

router.put('/update/:id', async (req: Request, res: Response): Promise<void> => {

    try {
        const { taxiid,from,to,userid } = req.body;

        const booking = await Booking.findById(taxiid);
        if (!booking) {
            res.status(404).json({ error: "Product not found" });
            return;
        }


        if (!taxiid) {
            res.status(400).json({ error: 'taxi ID is required.' });
            return;
        }
        if (!userid) {
            res.status(400).json({ error: 'user ID is required.' });
            return;
        }

        booking.taxiid = taxiid;
        booking.userid = userid;
        booking.from = from;
        booking.to = to;
        booking.pickup_time=req.body.pickup_time;
        booking.booking_date=req.body.booking_date;
        await booking.save();
        res.status(200).json({ message: "booking updated successfully", booking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;