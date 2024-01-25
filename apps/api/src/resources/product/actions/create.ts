import { z } from 'zod';

import { AppKoaContext, AppRouter, ProductUseCreateInput, ProductUseCreateOutput } from 'types';

import { productService } from 'resources/product';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  price: z.number().min(1, 'Please enter Price'),
  title: z.string().min(1, 'Please enter Title').max(100),
  quantity: z.number().min(1, 'Please enter Quantity'),
  photoUrl: z.string().min(1, 'Please upload Product\'s photo'),
});

type ValidationSchema = z.infer<typeof schema>;
type ValidatedData = {
  [K in keyof ValidationSchema]: K extends keyof ProductUseCreateInput ? ProductUseCreateInput[K] : never;
};

async function handler(ctx: AppKoaContext<ValidatedData> & { body: ProductUseCreateOutput }) {
  const { price, title, quantity, photoUrl } = ctx.validatedData;
  const { user } = ctx.state;

  await productService.insertOne({
    price,
    title,
    quantity,
    photoUrl,
    userId: user._id,
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/create', validateMiddleware(schema), handler);
};
