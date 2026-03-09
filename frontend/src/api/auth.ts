import request from '../utils/request'

export const register = (data: { username: string; email: string; password: string }) =>
  request.post('/api/auth/register', data)

export const login = (data: { account: string; password: string }) =>
  request.post<any, any>('/api/auth/login', data)
