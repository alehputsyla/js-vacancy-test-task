import { Next } from 'koa';

import { z } from 'zod';

import { AppKoaContext, AppRouter, Order } from 'types';

import { orderService } from 'resources/order';

import { validateMiddleware } from 'middlewares';

import { Stripe } from 'stripe';

import config from 'config';

import { ObjectId } from '@paralect/node-mongo';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const schema = z.object({
  orderId: z.string().refine((id) => ObjectId.isValid(id), 'Invalid order\'s id'),
});

interface ValidatedData extends z.infer<typeof schema> {
  order: Order
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { orderId } = ctx.validatedData;
  const { user } = ctx.state;

  const order = await orderService.findOne({
    _id: orderId,
    userId: user._id,
    paidOn: { $exists: false },
  });

  ctx.assertError(order, 'Invalid order\'s id');

  ctx.validatedData.order = order;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {  order } = ctx.validatedData;

  await Promise.all([
    stripe.checkout.sessions.expire(order.sessionId),
    orderService.deleteSoft({ _id: order._id }),
  ]);

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/', validateMiddleware(schema), validator, handler);
};