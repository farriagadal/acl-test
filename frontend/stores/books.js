import { defineStore } from 'pinia'

export const useBooksStore = defineStore('books', {
  state: () => ({
    searchResults: [],
    myLibrary: [],
    recentSearches: [],
    currentBook: null,
    loading: false,
    error: null
  }),

  getters: {
    hasSearchResults: (state) => state.searchResults.length > 0,
    hasMyLibrary: (state) => state.myLibrary.length > 0,
    hasRecentSearches: (state) => state.recentSearches.length > 0
  },

  actions: {
    // Buscar libros
    async searchBooks(query) {
      this.loading = true
      this.error = null
      
      try {
        const { $fetch } = useNuxtApp()
        const config = useRuntimeConfig()
        
        const response = await $fetch(`${config.public.apiBase}/api/books/search?q=${encodeURIComponent(query)}`)
        
        if (response.message) {
          this.searchResults = []
          this.error = response.message
        } else {
          this.searchResults = response.books || []
          this.error = null
        }
        
        // Cargar búsquedas recientes
        await this.loadRecentSearches()
        
      } catch (error) {
        console.error('Error buscando libros:', error)
        this.error = 'Error al buscar libros'
        this.searchResults = []
      } finally {
        this.loading = false
      }
    },

    // Cargar búsquedas recientes
    async loadRecentSearches() {
      try {
        const { $fetch } = useNuxtApp()
        const config = useRuntimeConfig()
        
        const searches = await $fetch(`${config.public.apiBase}/api/books/last-search`)
        this.recentSearches = searches || []
      } catch (error) {
        console.error('Error cargando búsquedas recientes:', error)
      }
    },

    // Cargar mi biblioteca
    async loadMyLibrary(filters = {}) {
      this.loading = true
      
      try {
        const { $fetch } = useNuxtApp()
        const config = useRuntimeConfig()
        
        const queryParams = new URLSearchParams()
        if (filters.search) queryParams.append('search', filters.search)
        if (filters.rating) queryParams.append('rating', filters.rating)
        if (filters.excludeNoReview) queryParams.append('excludeNoReview', filters.excludeNoReview)
        if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
        
        const books = await $fetch(`${config.public.apiBase}/api/books/my-library?${queryParams}`)
        this.myLibrary = books || []
        
      } catch (error) {
        console.error('Error cargando mi biblioteca:', error)
        this.error = 'Error al cargar mi biblioteca'
      } finally {
        this.loading = false
      }
    },

    // Guardar libro en mi biblioteca
    async saveBook(bookData) {
      try {
        const { $fetch } = useNuxtApp()
        const config = useRuntimeConfig()
        
        const savedBook = await $fetch(`${config.public.apiBase}/api/books/my-library`, {
          method: 'POST',
          body: bookData
        })
        
        // Agregar a la biblioteca local
        this.myLibrary.unshift(savedBook)
        
        return { success: true, book: savedBook }
        
      } catch (error) {
        console.error('Error guardando libro:', error)
        return { success: false, error: error.data?.error || 'Error al guardar libro' }
      }
    },

    // Actualizar libro
    async updateBook(bookId, updateData) {
      try {
        const { $fetch } = useNuxtApp()
        const config = useRuntimeConfig()
        
        const updatedBook = await $fetch(`${config.public.apiBase}/api/books/my-library/${bookId}`, {
          method: 'PUT',
          body: updateData
        })
        
        // Actualizar en la biblioteca local
        const index = this.myLibrary.findIndex(book => book._id === bookId)
        if (index !== -1) {
          this.myLibrary[index] = updatedBook
        }
        
        return { success: true, book: updatedBook }
        
      } catch (error) {
        console.error('Error actualizando libro:', error)
        return { success: false, error: error.data?.error || 'Error al actualizar libro' }
      }
    },

    // Eliminar libro
    async deleteBook(bookId) {
      try {
        const { $fetch } = useNuxtApp()
        const config = useRuntimeConfig()
        
        await $fetch(`${config.public.apiBase}/api/books/my-library/${bookId}`, {
          method: 'DELETE'
        })
        
        // Remover de la biblioteca local
        this.myLibrary = this.myLibrary.filter(book => book._id !== bookId)
        
        return { success: true }
        
      } catch (error) {
        console.error('Error eliminando libro:', error)
        return { success: false, error: error.data?.error || 'Error al eliminar libro' }
      }
    },

    // Obtener libro por ID
    async getBookById(bookId) {
      try {
        const { $fetch } = useNuxtApp()
        const config = useRuntimeConfig()
        
        const book = await $fetch(`${config.public.apiBase}/api/books/my-library/${bookId}`)
        this.currentBook = book
        return book
        
      } catch (error) {
        console.error('Error obteniendo libro:', error)
        return null
      }
    },

    // Limpiar estado
    clearState() {
      this.searchResults = []
      this.currentBook = null
      this.error = null
    }
  }
})
