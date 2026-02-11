import { Request, Response } from "express";
import Stripe from 'stripe';
import prisma from "../lib/prisma.js";


export const stripeWebHook = async (req: Request, res: Response) => {
    // Early return for non-POST requests
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    
    if (!endpointSecret) {
        console.error('Missing STRIPE_WEBHOOK_SECRET');
        return res.status(500).send('Configuration Error');
    }
    const signature = req.headers['stripe-signature'] as string;
    if (!signature) {
        console.error('Missing stripe-signature header');
        return res.status(400).send('Missing signature');
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            endpointSecret
        );
    } catch (err: any) {
        console.error(` Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;

                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });
                
                const session = sessionList.data[0];
                if (!session) {
                    console.log('No checkout session found for payment intent:', paymentIntent.id);
                    break;
                }

                const metadata = session.metadata;
                const transactionId = metadata?.transactionId;
                const appId = metadata?.appId;

                if (appId === 'AI-Site-Builder' && transactionId) {
                    // Update transaction
                    const transaction = await prisma.transaction.update({
                        where: { id: transactionId },
                        data: { isPaid: true }
                    });

                    await prisma.user.update({
                        where: { id: transaction.userId },
                        data: { credits: { increment: transaction.credits } }
                    });

                    console.log(`Successfully processed payment for transaction ${transactionId}`);
                } else {
                    console.log('Invalid metadata or appId:', { appId, hasTransactionId: !!transactionId });
                }
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (dbError: any) {
        console.error('Database error processing webhook:', dbError);
        // Don't return error to Stripe - just log it
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });
};
