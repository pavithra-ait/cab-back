import express from 'express';
import Stripe from 'stripe';
import Payment from '../Modules/payment';

const router = express.Router();
const stripe = new Stripe('sk_test_51QarsqB2pSOXCd2YDCJfV6KgixgERiwWH3n1UrZA6NlJCCvI6r2t0uTlUckUlizdr6eeJKRv19A4IIcbw4mvANHK00LrQe6Sfp' as string);

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { bookingid, amount, currency } = req.body;


        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { bookingid: bookingid.toString() },
        });

        const payment = new Payment({
            bookingid: bookingid,
            paymentIntentId: paymentIntent.id,
            amount,
            currency,
            status: 'pending',
        });
        await payment.save();

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.get('/payment-status', async (req, res) => {
    try {
        
        const payment = await Payment.find();

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve payment information.' });
    }
});

router.get('/payment-status/:paymentIntentId', async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        const payment = await Payment.findOne({ paymentIntentId });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve payment information.' });
    }
});

router.get('/payment-status/booking/:bookingid', async (req, res) => {
    try {
        const { bookingid } = req.params;

        const payment = await Payment.findOne({ bookingid });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve payment information.' });
    }
});

export default router;

