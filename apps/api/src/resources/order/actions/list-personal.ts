import { AppKoaContext, AppRouter } from 'types';

import { orderService } from 'resources/order';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const orders = await orderService.find(
    {
      $and: [
        { userId: user._id },
        { paidOn: { $ne: null } },
      ],
    },
    {},
    { sort: { paidOn: 'desc' } },
  );

  ctx.body = {
    items: orders.results,
    totalPages: orders.pagesCount,
    count: orders.count,
  };
}

export default (router: AppRouter) => {
  router.get('/list-personal', handler);
};
