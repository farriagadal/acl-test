<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <AppTitle />
        <button class="my-library-btn" @click="goToMyLibrary">
          Mi Biblioteca
        </button>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="main-content">
      <!-- Sección de búsqueda -->
      <section class="search-section">
        <h2 class="search-title">Encuentra tu próximo libro</h2>
        <p class="search-subtitle">Descubre miles de títulos en nuestra biblioteca digital</p>
        
        <form class="search-form" @submit.prevent="searchBooks">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Escribe el nombre de un Libro para continuar"
            required
          />
          <button 
            type="button" 
            class="search-btn"
            :disabled="loading"
            @click="searchBooks()"
          >
            {{ loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </form>

      </section>

      <!-- Búsquedas recientes -->
      <section v-if="hasRecentSearches" class="recent-searches">
        <h3 class="recent-title">Búsquedas recientes</h3>
        <div class="recent-tags">
          <span
            v-for="search in recentSearches"
            :key="search._id"
            class="recent-tag"
            @click="searchBooks(search.query)"
          >
            {{ search.query }}
          </span>
        </div>
      </section>

      <!-- Resultados de búsqueda -->
      <section v-if="hasSearchResults" class="search-results">
        <h3 class="results-title">Resultados de búsqueda</h3>
        <div class="results-grid">
          <div
            v-for="book in searchResults"
            :key="book.openLibraryId"
            class="book-card"
            @click="selectBook(book)"
          >
            <img
              v-if="book.coverImage"
              :src="book.coverImage"
              :alt="book.title"
              class="book-cover"
            />
            <div v-else class="book-cover">
              Sin portada disponible
            </div>
            <div class="book-info">
              <h4 class="book-title">{{ book.title }}</h4>
              <p class="book-author">{{ book.author }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Mensaje de error -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        Buscando libros...
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBooksStore } from '~/stores/books'
import AppTitle from '~/components/AppTitle.vue'

// Store
const booksStore = useBooksStore()

// Estado local
const searchQuery = ref('')

// Computed properties
const searchResults = computed(() => booksStore.searchResults)
const recentSearches = computed(() => booksStore.recentSearches)
const loading = computed(() => booksStore.loading)
const error = computed(() => booksStore.error)
const hasSearchResults = computed(() => booksStore.hasSearchResults)
const hasRecentSearches = computed(() => booksStore.hasRecentSearches)

// Métodos
const searchBooks = async (query = null) => {
  console.log('🔍 Función searchBooks llamada con query:', query)
  console.log('🔍 Valor actual de searchQuery.value:', searchQuery.value)
  
  // Si no se pasa query, usar el valor del input
  const searchTerm = query || searchQuery.value
  
  console.log('🔍 searchTerm final:', searchTerm, 'tipo:', typeof searchTerm)
  
  // Validar que searchTerm sea una cadena válida
  if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
    console.warn('Término de búsqueda inválido:', searchTerm, 'tipo:', typeof searchTerm)
    return
  }
  
  console.log('🔍 Buscando libros con término:', searchTerm)
  try {
    console.log('🔍 Llamando a booksStore.searchBooks con término:', searchTerm)
    await booksStore.searchBooks(searchTerm)
    console.log('✅ Búsqueda completada')
  } catch (error) {
    console.error('❌ Error en searchBooks:', error)
  }
  
  // Solo limpiar el input si no se pasó un query externo
  if (!query) {
    searchQuery.value = ''
  }
}


const selectBook = (book) => {
  // Guardar el libro seleccionado en el store
  booksStore.currentBook = book
  
  // Navegar a la página de detalle del libro
  navigateTo(`/book/${encodeURIComponent(book.title)}`)
}

const goToMyLibrary = () => {
  navigateTo('/my-library')
}

// Lifecycle
onMounted(async () => {
  try {
    console.log('🔄 Cargando búsquedas recientes...')
    await booksStore.loadRecentSearches()
    console.log('✅ Búsquedas recientes cargadas:', booksStore.recentSearches)
  } catch (error) {
    console.error('❌ Error en onMounted:', error)
  }
})
</script>
