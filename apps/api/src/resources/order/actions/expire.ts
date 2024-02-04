import { Next } from 'koa';

import { z } from 'zod';

import { AppKoaContext, AppRouter, Order } from 'types';

import { orderService } from 'resources/order';

import { validateMiddleware } from 'middlewares';

import { Stripe } from 'stripe';

import config from 'config';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const schema = z.object({
  cancelToken: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  order: Order
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { cancelToken } = ctx.validatedData;
  const { user } = ctx.state;

  const order = await orderService.findOne({
    cancelToken,
    userId: user._id,
  });

  ctx.assertError(order, 'Invalid token' );

  ctx.validatedData.order = order;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {  order } = ctx.validatedData;

  await stripe.checkout.sessions.expire(order.sessionId);

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/expire', validateMiddleware(schema), validator, handler);
};