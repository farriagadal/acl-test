// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/styles/main.scss'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3001'
    }
  },
  // Configuración de middleware global
  router: {
    middleware: ['auth']
  },
  routeRules: {
    '/my-library': { middleware: ['auth'] },
    '/book/**': { middleware: ['auth'] }
  },
  app: {
    head: {
      title: 'ACL Test - Biblioteca de Libros',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplicación de búsqueda y gestión de libros' }
      ]
    }
  },
  // Configuración para desarrollo
  devServer: {
    port: 3000
  }
})
