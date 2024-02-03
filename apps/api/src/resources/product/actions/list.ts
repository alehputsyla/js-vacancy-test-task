import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';

import { productService } from 'resources/product';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(6),
  sort: z.object({
    createdOn: z.enum(['asc', 'desc']),
  }).default({ createdOn: 'desc' }),
  filter: z.object({
    price: z.object({
      min: z.coerce.number(),
      max: z.coerce.number(),
    }).nullable().default(null),
  }).nullable().default(null),
  searchValue: z.string().default(''),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, searchValue, filter,
  } = ctx.validatedData;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  const products = await productService.find(
    {
      $and: [
        { quantity: { $gt: 0 } },
        {
          $or: [
            { title: { $regex: regExp } },
            { createdOn: {} },
          ],
        },
        filter?.price ? {
          price: {
            $gte: filter.price.min,
            $lt: filter.price.max + 1,
          },
        } : {},
      ],
    },
    { page, perPage },
    { sort },
  );

  const marketplaceCount = await productService.countDocuments({});

  ctx.body = {
    items: products.results,
    totalPages: products.pagesCount,
    count: products.count,
    marketplaceCount,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};
