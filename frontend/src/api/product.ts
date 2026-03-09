import request from '../utils/request'

export const getProducts = (params: {
  page?: number
  size?: number
  keyword?: string
  categoryId?: number
}) => request.get<any, any>('/api/products', { params })

export const getProductDetail = (id: number) =>
  request.get<any, any>(`/api/products/${id}`)

export const publishProduct = (data: {
  title: string
  description: string
  price: number
  categoryId: number
  conditionLevel: number
  images: string[]
}) => request.post<any, any>('/api/products', data)

export const updateProduct = (id: number, data: any) =>
  request.put<any, any>(`/api/products/${id}`, data)

export const deleteProduct = (id: number) =>
  request.delete(`/api/products/${id}`)

export const updateProductStatus = (id: number, status: number) =>
  request.put(`/api/products/${id}/status`, { status })

export const getMyProducts = (params: { page?: number; size?: number; status?: number }) =>
  request.get<any, any>('/api/products/my', { params })

export const getUserProducts = (userId: number, params?: { page?: number; size?: number }) =>
  request.get<any, any>(`/api/products/user/${userId}`, { params })
