import request from '../utils/request'

export const addFavorite = (productId: number) =>
  request.post(`/api/favorites/${productId}`)

export const removeFavorite = (productId: number) =>
  request.delete(`/api/favorites/${productId}`)

export const getFavorites = (params?: { page?: number; size?: number }) =>
  request.get<any, any>('/api/favorites', { params })
