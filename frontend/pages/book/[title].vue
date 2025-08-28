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
      <div class="book-detail">
        <!-- Header del libro -->
        <div class="book-header">
          <img
            v-if="bookData.coverImage"
            :src="bookData.coverImage"
            :alt="bookData.title"
            class="book-cover-large"
          />
          <div v-else class="book-cover-large">
            Sin portada disponible
          </div>
          
          <div class="book-info-large">
            <h1 class="book-title-large">{{ bookData.title }}</h1>
            <p class="book-author-large">Autor: {{ bookData.author }}</p>
            <p class="book-year">Año de publicación: {{ bookData.publicationYear }}</p>
          </div>
        </div>

        <!-- Formulario para review y calificación -->
        <form class="book-form" @submit.prevent="saveBook">
          <!-- Calificación -->
          <div class="form-group">
            <label>Calificación (1-5 estrellas)</label>
            <div class="rating-input">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ active: star <= rating }"
                @click="rating = star"
              >
                ★
              </span>
            </div>
          </div>

          <!-- Review -->
          <div class="form-group">
            <label>Review del libro (máximo 500 caracteres)</label>
            <textarea
              v-model="review"
              class="review-textarea"
              placeholder="Escribe tu opinión sobre este libro..."
              maxlength="500"
            ></textarea>
            <div class="char-count">
              {{ review.length }}/500 caracteres
            </div>
          </div>

          <!-- Botón guardar -->
          <button type="submit" class="save-btn" :disabled="!rating || saving">
            {{ saving ? 'Guardando...' : 'Guardar en Mi Biblioteca' }}
          </button>
        </form>
      </div>
    </main>

    <!-- Mensaje de éxito -->
    <div v-if="showSuccessMessage" class="success-message">
      ¡Libro guardado exitosamente en tu biblioteca!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBooksStore } from '~/stores/books'

// Store
const booksStore = useBooksStore()

// Route
const route = useRoute()

// Estado local
const rating = ref(0)
const review = ref('')
const saving = ref(false)
const showSuccessMessage = ref(false)

// Datos del libro desde la URL
const bookData = ref({
  title: decodeURIComponent(route.params.title),
  author: route.query.author || 'Autor desconocido',
  publicationYear: route.query.publicationYear || 'Año desconocido',
  coverImage: route.query.coverImage || null,
  openLibraryId: route.query.openLibraryId || '',
  coverId: route.query.coverId || ''
})

// Métodos
const saveBook = async () => {
  if (!rating.value) {
    alert('Por favor selecciona una calificación')
    return
  }

  saving.value = true

  try {
    // Convertir imagen a base64 si existe
    let coverImageBase64 = null
    if (bookData.value.coverImage) {
      coverImageBase64 = await convertImageToBase64(bookData.value.coverImage)
    }

    const bookDataToSave = {
      title: bookData.value.title,
      author: bookData.value.author,
      publicationYear: bookData.value.publicationYear,
      coverImage: coverImageBase64,
      review: review.value,
      rating: rating.value,
      openLibraryId: bookData.value.openLibraryId,
      coverId: bookData.value.coverId
    }

    const result = await booksStore.saveBook(bookDataToSave)

    if (result.success) {
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
      
      // Limpiar formulario
      rating.value = 0
      review.value = ''
    } else {
      alert(`Error: ${result.error}`)
    }
  } catch (error) {
    console.error('Error guardando libro:', error)
    alert('Error al guardar el libro')
  } finally {
    saving.value = false
  }
}

const convertImageToBase64 = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      
      ctx.drawImage(img, 0, 0)
      
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.8)
        resolve(dataURL)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Error cargando imagen'))
    }
    
    img.src = imageUrl
  })
}

const goToMyLibrary = () => {
  navigateTo('/my-library')
}

// Lifecycle
onMounted(() => {
  // Cargar búsquedas recientes
  booksStore.loadRecentSearches()
})
</script>
