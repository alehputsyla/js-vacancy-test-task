import { useMutation, useQuery } from 'react-query';

import { apiService } from 'services';

import { Order } from 'types';

import queryClient from 'query-client';

export function useCreate<T>() {
  const create = (data: T) => apiService.post('/order/create', data);

  interface OrderCreateResponse {
    url: string;
  }

  return useMutation<OrderCreateResponse, unknown, T>(create);
}

export function useListPersonal() {
  const list = () => apiService.get('/order/list-personal');

  interface OrderListPersonalResponse {
    count: number;
    items: Order[];
    totalPages: number;
  }

  return useQuery<OrderListPersonalResponse>(['orders-personal'], list);
}

export function useExpire<T>() {
  const create = (data: T) => apiService.post('/order/expire', data);

  return useMutation<{}, unknown, T>(create);
}

export function useRemove<T>() {
  const remove = (data: T) => apiService.delete('/order', data);

  return useMutation(remove, {
    onSuccess: () => {
      queryClient.refetchQueries(['orders-personal']);
    },
  });
}

export function useRetry<T>() {
  const retry = (data: T) => apiService.post('/order/retry', data);

  interface OrderRetryResponse {
    url: string,
  }

  return useMutation<OrderRetryResponse, unknown, T>(retry);
}
