import request from '../utils/request'

export const addReview = (data: {
  revieweeId: number
  productId: number
  score: number
  content?: string
}) => request.post('/api/reviews', data)

export const getReviewsByUser = (userId: number) =>
  request.get<any, any>(`/api/reviews/user/${userId}`)
