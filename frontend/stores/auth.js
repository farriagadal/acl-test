import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  actions: {
    login(username, password) {
      // Usuario estático para demostración
      const staticUser = {
        username: 'admin',
        password: '123456',
        name: 'Administrador'
      }

      // Validar credenciales
      if (username === staticUser.username && password === staticUser.password) {
        // Guardar usuario (sin la contraseña)
        this.user = {
          username: staticUser.username,
          name: staticUser.name
        }
        this.isAuthenticated = true
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('isAuthenticated', 'true')
        
        return { success: true }
      }
      
      return { success: false, error: 'Credenciales inválidas' }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      
      // Limpiar localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    },

    // Restaurar sesión desde localStorage
    initAuth() {
      if (process.client) {
        const user = localStorage.getItem('user')
        const isAuthenticated = localStorage.getItem('isAuthenticated')
        
        if (user && isAuthenticated === 'true') {
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        }
      }
    }
  },

  getters: {
    // Obtener nombre de usuario
    userName: (state) => state.user?.name || 'Invitado',
    
    // Verificar si está autenticado
    isLoggedIn: (state) => state.isAuthenticated
  }
})
