import { z } from 'zod';

import { productSchema } from 'schemas';

export type Product = z.infer<typeof productSchema>;

export type ProductUseCreateInput = Pick<Product, 'title' | 'price' | 'quantity' | 'photoUrl'>;
export type ProductUseCreateOutput = {};

export type ProductUseUploadPhotoInput = FormData;
export type ProductUseUploadPhotoOutput = Pick<Product, 'photoUrl'>;
