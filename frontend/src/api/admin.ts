import request from '../utils/request'

export const adminGetUsers = (page = 1, size = 20) =>
  request.get<any, any>('/api/admin/users', { params: { page, size } })

export const adminUpdateRole = (userId: number, role: string) =>
  request.put(`/api/admin/users/${userId}/role`, { role })

export const adminDeleteUser = (userId: number) =>
  request.delete(`/api/admin/users/${userId}`)

export const adminGetProducts = (page = 1, size = 20) =>
  request.get<any, any>('/api/admin/products', { params: { page, size } })

export const adminDeleteProduct = (productId: number) =>
  request.delete(`/api/admin/products/${productId}`)

export const adminGetComments = (page = 1, size = 20) =>
  request.get<any, any>('/api/admin/comments', { params: { page, size } })

export const adminDeleteComment = (commentId: number) =>
  request.delete(`/api/admin/comments/${commentId}`)
