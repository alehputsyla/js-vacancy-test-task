import { z } from 'zod';

import dbSchema from './db.schema';

export const productSchema = dbSchema.extend({
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  photoUrl: z.string(),

  userId: z.string(),
}).strict();
