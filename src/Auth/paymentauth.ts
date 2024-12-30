import express, { Request, Response } from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe('sk_test_51QarsqB2pSOXCd2YDCJfV6KgixgERiwWH3n1UrZA6NlJCCvI6r2t0uTlUckUlizdr6eeJKRv19A4IIcbw4mvANHK00LrQe6Sfp');

router.use(express.json());


router.use(express.urlencoded({ extended: true }));

router.use('/webhook', express.raw({ type: 'application/json' }));

router.post('/webhook', async (req: Request, res: Response) => {
    const endpointSecret = 'whsec_9e04169a4bf0d9d26e05402c0f9d86dcb726f22900617ca094795f19071548db'.trim();

    const sig = (req.headers as Record<string, string>)['stripe-signature'];
    let event;

    try {

        const buffer = Buffer.from(req.body);
        event = stripe.webhooks.constructEvent(buffer, sig, endpointSecret);
        console.log('Received Stripe event:', event);

        const paymentIntent = event.data?.object;
        if (paymentIntent) {
            console.log('PaymentIntent:', paymentIntent);
        }

        res.status(200).send('Event received');
    } catch (err) {

        console.log('Error processing webhook:', err);
        res.status(500).send(`Webhook error: ${err}`);
    }
});

router.post('/web', async (req, res) => {
    console.log('Request body:', req.body);  

    const { amount, currency, bookingid } = req.body;
    try {
        if (!amount || !currency || !bookingid) {
            return res.status(400).send({ error: 'Missing required fields: amount, currency, or bookingid' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { bookingid },
        });
        console.log('Payment intent data:', {
            amount,
            currency,
            bookingid
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ error: error });
    }
});

export default router;
