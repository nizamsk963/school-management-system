import express from 'express';
import Stripe from 'stripe';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2024-08-01' }) : null;

router.post('/create-payment-intent', authenticate, authorize('Student', 'Parent', 'Accountant', 'Admin', 'Principal'), async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: 'Stripe is not configured. Set STRIPE_SECRET_KEY in the server .env file.' });
  }
  try {
    const { amount, currency = 'usd', description, studentEmail } = req.body;
    if (!amount || !description || !studentEmail) {
      return res.status(400).json({ message: 'Payment amount, description, and studentEmail are required.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      description,
      metadata: {
        studentEmail,
        paymentType: description,
        paidBy: req.user.email,
        paidByRole: req.user.role
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe create-payment-intent error', error);
    res.status(500).json({ message: 'Unable to create payment intent.' });
  }
});

export { router as paymentsRouter };