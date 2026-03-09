import { create } from 'zustand'
import type { User } from '../types'

interface UserStore {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
  isLoggedIn: () => boolean
}

const savedUser = localStorage.getItem('user')
const savedToken = localStorage.getItem('token')

export const useUserStore = create<UserStore>((set, get) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  isLoggedIn: () => !!get().token,
}))
