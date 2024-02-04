import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';

import { productService } from 'resources/product';
import { orderService } from 'resources/order';

import { validateMiddleware } from 'middlewares';

import { ObjectId } from '@paralect/node-mongo';

import { Stripe } from 'stripe';

import config from 'config';

import moment from 'moment';

import { securityUtil } from 'utils';

const CURRENCY = 'usd';
const CENTS_IN_USD = 100;

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

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

  const products = results
    .map(({ _id, title, photoUrl, price }, index) => ({
      _id, title, photoUrl, price, quantity: cart[index].quantity,
    }));

  const checkOrders = await orderService.findOne({
    userId: user._id,
    paidOn: { $exists: false },
    products: {
      $size: products.length,
      $all: products.map(p => ({ $elemMatch: p })),
    },
  });

  if (checkOrders) {
    const { sessionUrl } = checkOrders;

    ctx.body = {
      url: sessionUrl,
    };

  } else {
    const check = results
      .some(({ quantity }, index) => quantity > 0 && quantity >= cart[index].quantity);

    ctx.assertError(check, 'Items in the cart has invalid id or quantity' );
    
    const lineItems = results
      .map(({ title, photoUrl, _id, price }, index) => (
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

    const cancelToken = await securityUtil.generateSecureToken();

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: lineItems,
      metadata: {
        userId: user._id,
        products: JSON.stringify(products),
      },
      mode: 'payment',
      success_url: `${config.WEB_URL}/payment/successfull`,
      cancel_url: `${config.WEB_URL}/payment/failed?token=${cancelToken}`,
      expires_at: moment().add(30, 'minutes').unix(),
    });

    await orderService.insertOne({
      userId: user._id,
      products,
      sessionId: session.id,
      sessionUrl: session.url || '',
      cancelToken,
    });

    ctx.body = {
      url: session.url,
    };
  }
}

export default (router: AppRouter) => {
  router.post('/create', validateMiddleware(schema), handler);
};