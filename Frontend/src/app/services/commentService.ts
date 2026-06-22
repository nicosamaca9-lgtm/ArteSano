import { fetchApi } from './api';

export const commentService = {
  getComments: () => fetchApi('/comment/'),
  createComment: (data: any) => fetchApi('/comment/create', { method: 'POST', body: JSON.stringify(data) }),
  deleteComment: (id: string) => fetchApi(`/comment/${id}`, { method: 'DELETE' }),
};
