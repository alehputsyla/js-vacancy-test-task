import { z } from 'zod';

import dbSchema from './db.schema';
import { productSchema } from './product.schema';

export const orderSchema = dbSchema.extend({
  sessionId: z.string(),
  products: z.array(
    productSchema.pick({ _id: true, price: true, quantity: true, title: true, photoUrl: true }),
  ),
  paidOn: z.date().optional().nullable(),

  userId: z.string(),
}).strict();
