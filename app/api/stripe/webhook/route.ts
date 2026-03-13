import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        await prisma.$transaction([
          prisma.payment.create({
            data: {
              userId,
              stripeSessionId: session.id,
              stripePaymentId: session.payment_intent as string | undefined,
              amount: session.amount_total ?? 0,
              currency: session.currency ?? 'usd',
              status: 'COMPLETED',
            },
          }),
          prisma.user.update({
            where: { id: userId },
            data: { isPremium: true },
          }),
        ]);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const customer = await stripe.customers.retrieve(customerId);
      if (customer && !customer.deleted && 'email' in customer && customer.email) {
        await prisma.user.updateMany({
          where: { email: customer.email },
          data: { isPremium: false },
        });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
