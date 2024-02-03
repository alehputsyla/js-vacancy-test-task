import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';

import { productService } from 'resources/product';
import { orderService } from 'resources/order';

import { validateMiddleware } from 'middlewares';

import { ObjectId } from '@paralect/node-mongo';

import { Stripe } from 'stripe';

import config from 'config';

import moment from 'moment';

const CURRENCY = 'usd';
const CENTS_IN_USD = 100;

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

const schema = z.object({
  cart: z.array(z.object({
    _id: z.string().refine((id) => ObjectId.isValid(id)),
    quantity: z.number().min(1),
  })),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { cart } = ctx.validatedData;
  const { user } = ctx.state;

  const productIDs = cart.map(({ _id }) => _id);

  const { results } = await productService.find({ _id: { $in: productIDs } });

  cart.sort((a, b) => (a._id > b._id ? 1 : -1));
  results.sort((a, b) => (a._id > b._id ? 1 : -1));

  const products = results.map(({ _id, title, photoUrl, price }, index) => ({
    _id, title, photoUrl, price, quantity: cart[index].quantity,
  }));

  const check = results
    .some(({ quantity }, index) => quantity > 0 && quantity >= cart[index].quantity);

  if (!check) {
    const checkOrders = await orderService.findOne({
      userId: user._id,
      products: {
        $elemMatch: {
          $or: products.map(product => ({ ...product })),
        },
      },
    });

    ctx.assertError(checkOrders, 'Items in the cart has invalid id or quantity' );

    const retrieve = await stripe.checkout.sessions.retrieve(checkOrders.sessionId);

    ctx.assertError(retrieve.url, 'Items in the cart has invalid id or quantity' );

    ctx.body = {
      url: retrieve.url,
    };
  } else {
    const lineItems = results.map(({ title, photoUrl, _id, price }, index) => (
      {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: title,
            images: [photoUrl],
            metadata: {
              id: _id,
            },
          },
          unit_amount: price * CENTS_IN_USD,
        },
        quantity: cart[index].quantity,
      }
    ));

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: lineItems,
      metadata: {
        userId: user._id,
        products: JSON.stringify(products),
      },
      mode: 'payment',
      success_url: `${config.WEB_URL}/payment/successfull`,
      cancel_url: `${config.WEB_URL}/payment/failed`,
      expires_at: moment().add(30, 'minutes').unix(),
    });

    await orderService.insertOne({
      userId: user._id,
      products,
      sessionId: session.id,
    });

    ctx.body = {
      url: session.url,
    };
  }
}

export default (router: AppRouter) => {
  router.post('/create', validateMiddleware(schema), handler);
};