import { fetchApi } from './api';

export const productService = {
  getProducts: () => fetchApi('/product/'),
  getProductById: (id: string) => fetchApi(`/product/${id}`),
  createProduct: (formData: FormData) => fetchApi('/product/create', { method: 'POST', body: formData }),
  updateProduct: (id: string, formData: FormData) => fetchApi(`/product/${id}`, { method: 'PUT', body: formData }),
  deleteProduct: (id: string) => fetchApi(`/product/${id}`, { method: 'DELETE' }),
};
