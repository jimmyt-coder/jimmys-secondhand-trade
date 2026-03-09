export interface User {
  id: number
  username: string
  email: string
  nickname: string
  avatar: string | null
  bio: string | null
  creditScore: number
  role: string
  createdAt: string
}

export interface Category {
  id: number
  name: string
  icon: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  conditionLevel: number
  status: number
  coverImage: string | null
  images: string[] | null
  viewCount: number
  createdAt: string
  categoryId: number
  categoryName: string
  sellerId: number
  sellerNickname: string
  sellerAvatar: string | null
  sellerCreditScore: number
  favorited: boolean | null
}

export interface Message {
  id: number
  senderId: number
  receiverId: number
  productId: number | null
  content: string
  isRead: number
  createdAt: string
}

export interface Conversation {
  otherUserId: number
  otherUserNickname: string
  otherUserAvatar: string | null
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  productId: number | null
  productTitle: string | null
  productCoverImage: string | null
}

export interface Review {
  id: number
  reviewerId: number
  reviewerNickname: string
  reviewerAvatar: string | null
  productId: number
  productTitle: string
  score: number
  content: string
  createdAt: string
}

export interface Page<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export interface Result<T> {
  code: number
  message: string
  data: T
}
