import express from 'express';
import Stripe from 'stripe';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2024-08-01' }) : null;

// Payment methods supported
const PAYMENT_METHODS = {
  CARD: 'Card',
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  CHEQUE: 'Cheque',
  NET_BANKING: 'Net Banking',
  UPI: 'UPI'
};

// Create payment intent for Stripe (Card payments)
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

// Record offline payment (Cash, Cheque, Bank Transfer, etc.)
router.post('/record-payment', authenticate, authorize('Accountant', 'Admin', 'Principal'), async (req, res) => {
  try {
    const { studentEmail, amount, paymentMethod, description, referenceNumber, notes } = req.body;
    
    if (!studentEmail || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'studentEmail, amount, and paymentMethod are required.' });
    }

    // Validate payment method
    if (!Object.values(PAYMENT_METHODS).includes(paymentMethod)) {
      return res.status(400).json({ message: `Invalid payment method. Allowed: ${Object.values(PAYMENT_METHODS).join(', ')}` });
    }

    // Record payment in system
    const paymentRecord = {
      studentEmail,
      amount,
      paymentMethod,
      description,
      referenceNumber,
      notes,
      recordedBy: req.user.email,
      recordedByRole: req.user.role,
      recordedAt: new Date(),
      status: 'Completed'
    };

    res.json({ 
      message: `Payment of ₹${amount} recorded successfully via ${paymentMethod}`,
      paymentRecord
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ message: 'Unable to record payment.' });
  }
});

// Get available payment methods
router.get('/payment-methods', authenticate, async (req, res) => {
  try {
    res.json({
      paymentMethods: Object.entries(PAYMENT_METHODS).map(([key, value]) => ({
        id: key,
        name: value,
        description: getPaymentMethodDescription(value),
        requiresReference: value === PAYMENT_METHODS.CHEQUE || value === PAYMENT_METHODS.BANK_TRANSFER
      }))
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Unable to fetch payment methods.' });
  }
});

function getPaymentMethodDescription(method) {
  const descriptions = {
    [PAYMENT_METHODS.CARD]: 'Credit/Debit Card payment via Stripe',
    [PAYMENT_METHODS.CASH]: 'Direct cash payment at school',
    [PAYMENT_METHODS.BANK_TRANSFER]: 'Online bank transfer or NEFT/RTGS',
    [PAYMENT_METHODS.CHEQUE]: 'Payment via cheque (requires cheque number)',
    [PAYMENT_METHODS.NET_BANKING]: 'Online net banking payment',
    [PAYMENT_METHODS.UPI]: 'UPI/Digital wallet payment'
  };
  return descriptions[method] || 'Payment method';
}

export { router as paymentsRouter };