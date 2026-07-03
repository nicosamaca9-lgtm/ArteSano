import { fetchApi } from './api';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export const orderService = {
  createPreference: async (items: OrderItem[], address: string) => {
    return await fetchApi('/order/create-preference', {
      method: 'POST',
      body: JSON.stringify({ items, address }),
    });
  },
};
