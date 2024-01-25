import multer from '@koa/multer';

import { AppKoaContext, AppRouter, Next, ProductUseUploadPhotoInput, ProductUseUploadPhotoOutput } from 'types';

import { cloudStorageService } from 'services';

const upload = multer();

const ONE_MB_IN_BYTES = 1048576;

async function validator(ctx: AppKoaContext<ProductUseUploadPhotoInput>, next: Next) {
  const { file } = ctx.request;

  ctx.assertClientError(file, { file: 'File cannot be empty' });
  ctx.assertClientError(file.size / ONE_MB_IN_BYTES < 2, { file: 'Sorry, you cannot upload a photo larger than 2 MB.' });
  ctx.assertClientError(['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype), { file: 'Sorry, you can only upload JPG, JPEG or PNG photos.' });

  await next();
}

async function handler(ctx: AppKoaContext<ProductUseUploadPhotoInput> & { body: ProductUseUploadPhotoOutput }) {
  const { user } = ctx.state;
  const { file } = ctx.request;

  const fileName = `${user._id}-${Date.now()}-${file.originalname}`;
  const { Location } = await cloudStorageService.uploadPublic(`product/${fileName}`, file);

  ctx.assertClientError(Location, { file: 'An error occurred while uploading a photo. Try again.' });

  ctx.body = { photoUrl: Location };
}

export default (router: AppRouter) => {
  router.post('/upload-photo', upload.single('file'), validator, handler);
};
