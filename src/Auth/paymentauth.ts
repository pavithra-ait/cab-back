import { Request, Response } from 'express';
import { Payment } from '../Modules/payment';
import  Booking  from '../Modules/Booking';



class PaymentController {
    async indexdata(req: Request, res: Response): Promise<void> {
        try {
            const payment = await Payment.findById(req.params._id);

            if (!payment) {
                res.status(404).json({ error: 'payment not found.' });
                return;
            }

            res.status(200).json(payment);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
    async getdata(req: Request, res: Response): Promise<void> {
        try {
            const pay = await Payment.find(req.body);
            res.status(200).json(pay);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
    async createdata(req: Request, res: Response) {
        try {
            const { bookingid } = req.body;

            if (!bookingid) {
                return res.status(400).json({ error: 'Booking ID is required.' });
            }

            const booking = await Booking.findById(bookingid);
            if (!booking) {
                return res.status(404).json({ error: 'Booking not found.' });
            }
            const perkm_charge = 20;
            const distance = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
            const total_amount = distance *perkm_charge;


            if (isNaN(total_amount) || total_amount <= 0) {
                return res.status(400).json({ error: 'Invalid total amount calculated.' });
            }

            const total_amount_str = total_amount.toString();
            const perkm_charge_str = perkm_charge;

            
            const newpayment = await Payment.create({
                bookingid: bookingid,
                from: booking.from,
                to: booking.to,
                perkm_charge: perkm_charge_str,  
                total_distance: distance.toString(), 
                total_amount: total_amount_str,  
            });

            res.status(201).json(newpayment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deletedata(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const payment = await Payment.findByIdAndDelete(id);

            if (!payment) {
                res.status(404).json({ error: 'Payment not found.' });
                return;
            }

            res.status(200).json({ message: 'Payment details was deleted.' });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}

export default new PaymentController();