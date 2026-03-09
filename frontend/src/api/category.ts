import request from '../utils/request'

export const getCategories = () => request.get<any, any>('/api/categories')
