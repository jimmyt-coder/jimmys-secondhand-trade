import request from '../utils/request'

export const sendMessage = (data: { receiverId: number; productId?: number; content: string }) =>
  request.post('/api/messages', data)

export const getConversations = () => request.get<any, any>('/api/messages/conversations')

export const getChatHistory = (userId: number) =>
  request.get<any, any>(`/api/messages/${userId}`)

export const getUnreadCount = () => request.get<any, any>('/api/messages/unread-count')
