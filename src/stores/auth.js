import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,   // 'admin' | 'mahasiswa'
    token: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
    isMahasiswa: (state) => state.role === 'mahasiswa',
  },
  actions: {
    login(userData) {
      this.user = userData.user
      this.role = userData.role
      this.token = userData.token
    },
    logout() {
      this.user = null
      this.role = null
      this.token = null
    },
  },
  persist: true, // butuh pinia-plugin-persistedstate
})