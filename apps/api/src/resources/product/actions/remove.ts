import { AppKoaContext, AppRouter, Next } from 'types';

import { z } from 'zod';

import { productService } from 'resources/product';

import { ObjectId } from '@paralect/node-mongo';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  id: z.string().refine((id) => ObjectId.isValid(id), 'Invalid product\'s id'),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const isProductExists = await productService.exists({ _id: ctx.validatedData.id });

  ctx.assertError(isProductExists, 'Product not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  await productService.deleteSoft({ _id: ctx.validatedData.id });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/', validateMiddleware(schema), validator, handler);
};
