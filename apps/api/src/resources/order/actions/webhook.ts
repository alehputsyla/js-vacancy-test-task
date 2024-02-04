import { Next } from 'koa';

import { AppKoaContext, AppRouter } from 'types';

import { orderService } from 'resources/order';

import { Stripe } from 'stripe';

import config from 'config';

import moment from 'moment';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

interface ValidatedData {
  event: Stripe.Event;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { rawBody } = ctx.request;
  const stripeSignature = ctx.headers['stripe-signature'] || '';

  const event = stripe.webhooks.constructEvent(
    rawBody,
    stripeSignature,
    config.STRIPE_WEBHOOK_SECRET_KEY,
  );

  ctx.validatedData = {
    event,
  };

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { event } = ctx.validatedData;

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      if (session.payment_status === 'paid') {
        await orderService.updateOne(
          { sessionId: session.id,
            paidOn: { $exists: false },
          },
          () => ({ paidOn: moment().toDate() }),
        );
      }

      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;

      await orderService.deleteSoft({ sessionId: session.id });

      break;
    }
  }

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/webhook', validator, handler);
};