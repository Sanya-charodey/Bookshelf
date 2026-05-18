import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<User | null>(null)

  function login() {
    isAuthenticated.value = true
    user.value = { id: '1', name: 'Гость' }
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
  }

  return { isAuthenticated, user, login, logout }
})
