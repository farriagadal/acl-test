import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente
  if (process.client) {
    const authStore = useAuthStore()
    
    // Verificar si el usuario está autenticado
    if (!authStore.isLoggedIn && to.path !== '/login') {
      // Redirigir a login
      return navigateTo('/login')
    }
    
    // Si está autenticado y va a login, redirigir a inicio
    if (authStore.isLoggedIn && to.path === '/login') {
      return navigateTo('/')
    }
  }
})
