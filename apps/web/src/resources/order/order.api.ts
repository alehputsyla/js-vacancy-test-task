import { useMutation, useQuery } from 'react-query';

import { apiService } from 'services';

import { Order } from 'types';

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

  return useQuery<OrderListPersonalResponse>(['order-personal'], list);
}
