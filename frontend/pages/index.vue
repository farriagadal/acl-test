<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>📚 Biblioteca ACL Test</h1>
        </div>
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
            type="submit" 
            class="search-btn"
            :disabled="loading"
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
  const searchTerm = query || searchQuery.value
  if (!searchTerm.trim()) return
  
  await booksStore.searchBooks(searchTerm)
  if (!query) {
    searchQuery.value = ''
  }
}

const selectBook = (book) => {
  // Navegar a la página de detalle del libro
  navigateTo(`/book/${encodeURIComponent(book.title)}`, {
    query: {
      openLibraryId: book.openLibraryId,
      coverId: book.coverId,
      author: book.author,
      publicationYear: book.publicationYear,
      coverImage: book.coverImage
    }
  })
}

const goToMyLibrary = () => {
  navigateTo('/my-library')
}

// Lifecycle
onMounted(async () => {
  await booksStore.loadRecentSearches()
})
</script>
