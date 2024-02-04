import { Next } from 'koa';

import { z } from 'zod';

import { AppKoaContext, AppRouter, Order } from 'types';

import { orderService } from 'resources/order';

import { validateMiddleware } from 'middlewares';

import { ObjectId } from '@paralect/node-mongo';

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
  });

  ctx.assertError(order, 'Invalid order\'s id');

  ctx.validatedData.order = order;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {  order } = ctx.validatedData;

  ctx.body = {
    url: order.sessionUrl,
  };
}

export default (router: AppRouter) => {
  router.post('/retry', validateMiddleware(schema), validator, handler);
};