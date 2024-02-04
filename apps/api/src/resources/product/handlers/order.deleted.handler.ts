import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { Order } from 'types';

import { DATABASE_DOCUMENTS } from 'app-constants';

import logger from 'logger';

import { productService } from 'resources/product';

const { ORDERS } = DATABASE_DOCUMENTS;

eventBus.on(`${ORDERS}.deleted`, async (data: InMemoryEvent<Order>) => {
  try {
    const { products } = data.doc;

    const updatePromises = products.map( async ({ _id, quantity: cartQuantity }) => {
      await productService.updateOne(
        { _id },
        ({ quantity: productQuantity }) => ({
          quantity: productQuantity + cartQuantity,
        }),
      );
    });

    await Promise.all(updatePromises);

  } catch (err) {
    logger.error(`${ORDERS}.deleted handler error: ${err}`);
  }
});
