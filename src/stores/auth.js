// src/stores/auth.js
import { ref } from 'vue'

export const isAuthenticated = ref(!!localStorage.getItem('jwtToken'))

export function logIn(token) {
  localStorage.setItem('jwtToken', token)
  isAuthenticated.value = true
}

export function logOut() {
  localStorage.removeItem('jwtToken')
  isAuthenticated.value = false
}
