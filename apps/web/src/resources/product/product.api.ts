import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';

import { Product } from 'types';

import { apiService } from 'services';

export function useCreate<T>() {
  const create = (data: T) => apiService.post('/product/create', data);

  return useMutation<{}, unknown, T>(create);
}

export function useListPersonal() {
  const list = () => apiService.get('/product/list-personal');

  interface ListPersonalResponse {
    count: number;
    items: Product[];
    totalPages: number;
  }

  return useQuery<ListPersonalResponse>(['products-personal'], list);
}

export function useRemove<T>() {
  const removeProduct = (data: T) => apiService.delete('/product', data);

  return useMutation(removeProduct, {
    onSuccess: () => {
      queryClient.refetchQueries(['products-personal']);
    },
  });
}

export function useList<T>(params: T) {
  const list = () => apiService.get('/product', params);

  interface ProductListResponse {
    count: number;
    items: Product[];
    totalPages: number;
    marketplaceCount: number;
  }

  return useQuery<ProductListResponse>(['products', params], list);
}
