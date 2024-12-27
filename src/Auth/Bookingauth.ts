import { Request, Response } from 'express';
import Booking from '../Modules/Booking';

class BookingController {
    async indexdata(req: Request, res: Response): Promise<void> {
        try {
            const taxi = await Booking.findById(req.params._id);

            if (!taxi) {
                res.status(404).json({ error: 'Taxi not found.' });
                return;
            }

            res.status(200).json(taxi);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
   
    async getdata(req: Request, res: Response): Promise<void> {
        const taxiid = req.query.taxiid;

        if (taxiid) {

            Booking.find({ taxiid: taxiid })
                .then(bookings => res.json(bookings))
                .catch(err => res.status(500).json({ error: err }));
        } else {

            Booking.find()
                .then(bookings => res.json(bookings))
                .catch(err => res.status(500).json({ error: err }));
        }
    }
    async createdata(req: Request, res: Response) {
        const newbooking = await Booking.create({
            taxiid: req.body.taxiid,
            userid: req.body.userid,
            pickup_time: req.body.pickup_time,
            booking_date: req.body.booking_date,
            from: req.body.from,
            to: req.body.to
        })
        res.send(newbooking)
    }

    async deletedata(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const booking = await Booking.findByIdAndDelete(id);

            if (!booking) {
                res.status(404).json({ error: 'Taxi not found.' });
                return;
            }

            res.status(200).json({ message: 'Booking cancelled successfully.' });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}

export default new BookingController();