import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isAdminOrViewer: false,
  loading: true,

  hydrateAuth: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      const parsedUser = JSON.parse(user)
      set({
        token,
        user: parsedUser,
        isAuthenticated: true,
        isAdmin: parsedUser?.role === 'admin',
        isAdminOrViewer: parsedUser?.role === 'admin' || parsedUser?.role === 'viewer',
        loading: false,
      })
    } else {
      set({ loading: false })
    }
  },

  login: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user?.role === 'admin',
      isAdminOrViewer: user?.role === 'admin' || user?.role === 'viewer',
    })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isAdminOrViewer: false,
    })
  },
}))

export default useAuthStore
