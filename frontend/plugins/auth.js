export default defineNuxtPlugin(async (nuxtApp) => {
  // Esperar a que Pinia esté lista
  await nuxtApp.runWithContext(async () => {
    const authStore = useAuthStore()
    
    // Inicializar autenticación
    authStore.initAuth()
  })
})
