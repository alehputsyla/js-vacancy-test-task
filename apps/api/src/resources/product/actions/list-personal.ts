import { AppKoaContext, AppRouter } from 'types';

import { productService } from 'resources/product';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const products = await productService.find(
    {
      $and: [
        { userId: user._id },
      ],
    },
    {},
    { sort: { createdOn: 'desc' } },
  );

  ctx.body = {
    items: products.results,
    totalPages: products.pagesCount,
    count: products.count,
  };
}

export default (router: AppRouter) => {
  router.get('/list-personal', handler);
};
