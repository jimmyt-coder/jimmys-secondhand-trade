import request from '../utils/request'

export const getComments = (productId: number) =>
  request.get<any, any>(`/api/products/${productId}/comments`)

export const addComment = (productId: number, content: string) =>
  request.post(`/api/products/${productId}/comments`, { content })

export const deleteComment = (productId: number, commentId: number) =>
  request.delete(`/api/products/${productId}/comments/${commentId}`)
