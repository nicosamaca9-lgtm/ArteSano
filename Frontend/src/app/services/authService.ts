import { fetchApi } from './api';

export const authService = {
  login: (data: any) => fetchApi('/user/', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => fetchApi('/user/create', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchApi('/user/logout', { method: 'POST' }),
  getCredentials: () => fetchApi('/user/', { method: 'GET' }),
};
