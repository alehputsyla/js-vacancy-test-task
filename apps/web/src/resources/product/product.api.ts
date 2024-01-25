import { useMutation } from 'react-query';

import { ProductUseCreateInput, ProductUseCreateOutput, ProductUseUploadPhotoInput, ProductUseUploadPhotoOutput } from 'types';

import { apiService } from 'services';

export function useCreate() {
  const add = (data: ProductUseCreateInput) => apiService.post('/product/create', data);

  return useMutation<ProductUseCreateOutput, unknown, ProductUseCreateInput>(add);
}

export function useUploadPhoto() {
  const add = (data: ProductUseUploadPhotoInput) => apiService.post('/product/upload-photo', data);

  return useMutation<ProductUseUploadPhotoOutput, unknown, ProductUseUploadPhotoInput>(add);
}
