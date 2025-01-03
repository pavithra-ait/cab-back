import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {Stripe} from 'stripe';
import Booking from '../Modules/Booking';  

dotenv.config();

const stripeSecretKey = 'sk_test_51QarsqB2pSOXCd2YDCJfV6KgixgERiwWH3n1UrZA6NlJCCvI6r2t0uTlUckUlizdr6eeJKRv19A4IIcbw4mvANHK00LrQe6Sfp'
if (!stripeSecretKey) {
    console.error("Stripe secret key is missing!");
    process.exit(1);
}

// Initialize Stripe with the correct API key
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
});

const router = express.Router();

router.post('/create-checkout-session', async (req: Request, res: Response) => {
    const { amount, currency, pickupLocation, dropoffLocation } = req.body;

    try {
        // Step 1: Create a payment intent with the received amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card'],
        });

        const booking = new Booking({
            amount: amount,
            currency: currency,
            pickupLocation: pickupLocation,
            dropoffLocation: dropoffLocation,
            paymentIntentId: paymentIntent.id,
            status: 'pending',  // Payment is still pending until confirmation
        });

        // Save the booking to the database
        await booking.save();

        // Step 3: Send clientSecret to the frontend to confirm payment
        res.json({ clientSecret: paymentIntent.client_secret, bookingId: booking.id });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send('Error creating payment intent');
    }
});

// Webhook handler to listen for successful payments and update the database
router.post(
    "/webhooks",
    bodyParser.raw({ type: 'application/json' }),
    async (req: Request, res: Response) => {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event: Stripe.Event;

        try {
            // Verify Stripe webhook signature
            if (webhookSecret) {
                const signature = req.headers["stripe-signature"];
                if (!signature) {
                    return res.status(400).send("Stripe signature missing.");
                }

                // Construct the event and verify its signature
                event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
            } else {
                event = req.body as Stripe.Event;
            }

            // Handle different Stripe events
            switch (event.type) {
                case 'payment_intent.succeeded': {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    console.log(`PaymentIntent was successful! ID: ${paymentIntent.id}`);

                    // Find the booking in the database and update its status
                    const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
                    if (booking) {
                        booking.status = 'completed';  // Mark the booking as completed
                        await booking.save();
                    }
                    break;
                }

                case 'payment_intent.payment_failed': {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    console.log(`Payment failed! ID: ${paymentIntent.id}`);

                    // Handle failed payment logic (e.g., mark the booking as failed)
                    const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
                    if (booking) {
                        booking.status = 'failed';  // Mark the booking as failed
                        await booking.save();
                    }
                    break;
                }

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            // Respond with the received event
            return res.json({ received: true });
        } catch (error) {
            console.error("Webhook error:", error);
            return res.status(400).send(`Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
);

export default router;





