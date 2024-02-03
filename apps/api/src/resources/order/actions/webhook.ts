import { Next } from 'koa';

import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';

import { productService } from 'resources/product';
import { orderService } from 'resources/order';

import { validateMiddleware } from 'middlewares';

import { ObjectId } from '@paralect/node-mongo';

import { Stripe } from 'stripe';

import config from 'config';

import moment from 'moment';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

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
          { sessionId: session.id },
          ()=> ({ paidOn: moment.unix(session.created).toDate() }),
        );
      }

      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;

      await orderService.updateOne(
        { sessionId: session.id },
        ()=> ({ paidOn: moment(session.created).toDate() }),
      );

      break;
    }

    case 'checkout.session.async_payment_failed':
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