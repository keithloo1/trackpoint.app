
import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
router.post('/create-checkout', async (req, res) => {
  const { amount, productName, clientEmail, clientId, serviceId, sessionsAdded, successUrl, cancelUrl } = req.body;

  // Validate required fields
  if (!amount || !productName || !successUrl || !cancelUrl) {
    return res.status(400).json({ 
      error: 'Missing required fields: amount, productName, successUrl, cancelUrl' 
    });
  }

  // Validate amount is a positive number (in cents)
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ 
      error: 'Amount must be a positive number (in cents)' 
    });
  }

  // Build metadata object (optional fields)
  const metadata = {};
  if (clientId) metadata.clientId = clientId;
  if (serviceId) metadata.serviceId = serviceId;
  if (sessionsAdded) metadata.sessionsAdded = String(sessionsAdded);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'myr',
          product_data: {
            name: productName,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    ...(clientEmail && { customer_email: clientEmail }),
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...(Object.keys(metadata).length > 0 && { metadata }),
  });

  logger.info(`Checkout session created: ${session.id} for ${productName} (MYR ${amount / 100})`);
  res.json({ url: session.url });
});

// Retrieve Checkout Session
router.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  res.json({
    id: session.id,
    payment_status: session.payment_status,
    amountTotal: session.amount_total,
    customerEmail: session.customer_details?.email,
  });
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const { clientId, serviceId, sessionsAdded } = session.metadata || {};

      // Get current user (assuming authenticated context)
      const authData = pb.authStore.model;
      const userId = authData?.id;

      if (!userId) {
        logger.warn('No authenticated user found for webhook processing');
        res.json({ received: true });
        return;
      }

      // Only process if we have the required metadata
      if (clientId && serviceId && sessionsAdded) {
        // Create payment record in 'payments' collection
        // The PocketBase hook (update-sessions-on-payment.pb.js) will automatically
        // handle incrementing the client's sessionsRemaining when this record is created
        await pb.collection('payments').create({
          clientId,
          userId,
          packageId: serviceId,
          amount: session.amount_total / 100,
          sessionsAdded: parseInt(sessionsAdded, 10),
          stripeSessionId: session.id,
          status: 'completed',
          paymentDate: new Date().toISOString(),
        });

        logger.info(`Payment record created for client ${clientId}: ${session.amount_total / 100} MYR, ${sessionsAdded} sessions. PocketBase hook will handle session increment.`);
      } else {
        logger.info(`Checkout completed for session ${session.id} but no metadata found for database update`);
      }
    } catch (error) {
      logger.error('Error processing webhook event:', error);
      throw error;
    }
  }

  res.json({ received: true });
});

export default router;
