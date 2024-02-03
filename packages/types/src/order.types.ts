import { z } from 'zod';

import { orderSchema } from 'schemas';

export type Order = z.infer<typeof orderSchema>;
