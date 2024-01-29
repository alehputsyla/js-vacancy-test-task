import { Next } from 'koa';
import multer from '@koa/multer';

import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';

import { cloudStorageService } from 'services';

import { productService } from 'resources/product';

import { validateMiddleware } from 'middlewares';

const upload = multer();

const ONE_MB_IN_BYTES = 1048576;
const IMAGE_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;

  ctx.assertClientError(file, { photo: 'File cannot be empty' });
  ctx.assertClientError(file.size / ONE_MB_IN_BYTES < 2, { photo: 'Sorry, you cannot upload a photo larger than 2 MB.' });
  ctx.assertClientError(IMAGE_FORMATS.includes(file.mimetype), { photo: 'Sorry, you can only upload JPG, JPEG or PNG photos.' });

  await next();
}

const schema = z.object({
  price: z.coerce.number().min(1, 'Please enter Price'),
  title: z.string().min(1, 'Please enter Title').max(100),
  quantity: z.coerce.number().min(1, 'Please enter Quantity'),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { price, title, quantity } = ctx.validatedData;
  const { user } = ctx.state;
  const { file } = ctx.request;

  const fileName = `${user._id}-${Date.now()}-${file.originalname}`;
  const { Location: photoUrl } = await cloudStorageService.uploadPublic(`product/${fileName}`, file);

  ctx.assertClientError(photoUrl, { photo: 'An error occurred while uploading a photo. Try again.' });

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
  router.post('/create', upload.single('file'), validator, validateMiddleware(schema), handler);
};
