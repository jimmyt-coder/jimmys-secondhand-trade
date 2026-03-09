import request from '../utils/request'

export const getMe = () => request.get<any, any>('/api/users/me')

export const getUserById = (id: number) => request.get<any, any>(`/api/users/${id}`)

export const updateMe = (data: { nickname?: string; bio?: string; avatar?: string }) =>
  request.put('/api/users/me', data)
