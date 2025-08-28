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
import AppTitle from '~/components/AppTitle.vue'

// Store
const booksStore = useBooksStore()

// Route
const route = useRoute()

// Estado local
const rating = ref(0)
const review = ref('')
const saving = ref(false)
const showSuccessMessage = ref(false)

// Datos del libro desde el Store
const bookData = ref({
  title: '',
  author: 'Autor desconocido',
  publicationYear: 'Año desconocido',
  coverImage: null,
  openLibraryId: '',
  coverId: ''
})

// Cargar datos del libro desde el store
onMounted(() => {
  // Cargar búsquedas recientes
  booksStore.loadRecentSearches()
  
  if (booksStore.currentBook) {
    bookData.value = { ...booksStore.currentBook }
    console.log('Datos del libro cargados desde store:', bookData.value)
  } else {
    // Fallback: intentar obtener datos de la URL si no hay libro en el store
    bookData.value = {
      title: decodeURIComponent(route.params.title),
      author: route.query.author || 'Autor desconocido',
      publicationYear: route.query.publicationYear || 'Año desconocido',
      coverImage: route.query.coverImage || null,
      openLibraryId: route.query.openLibraryId || '',
      coverId: route.query.coverId || ''
    }
    console.log('Datos del libro cargados desde URL:', bookData.value)
  }
})

// Métodos
const saveBook = async () => {
  if (!rating.value) {
    alert('Por favor selecciona una calificación')
    return
  }

  // Validar que tengamos los datos mínimos requeridos
  if (!bookData.value.openLibraryId || bookData.value.openLibraryId.trim() === '') {
    alert('Error: ID del libro no disponible')
    return
  }

  saving.value = true

  try {
    // Convertir imagen a base64 si existe
    let coverImageBase64 = null
    if (bookData.value.coverImage && bookData.value.coverImage !== 'null') {
      try {
        coverImageBase64 = await convertImageToBase64(bookData.value.coverImage)
      } catch (error) {
        console.warn('No se pudo convertir la imagen a base64:', error)
        // Usar una imagen por defecto
        coverImageBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIGltYWdlbjwvdGV4dD48L3N2Zz4='
      }
    } else {
      // Imagen por defecto si no hay portada
      coverImageBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIGltYWdlbjwvdGV4dD48L3N2Zz4='
    }

    // Procesar año de publicación
    let publicationYear = null
    if (bookData.value.publicationYear && bookData.value.publicationYear !== 'Año desconocido') {
      const year = parseInt(bookData.value.publicationYear)
      if (!isNaN(year) && year > 0) {
        publicationYear = year
      }
    }
    
    // Si no hay año válido, usar el año actual
    if (!publicationYear) {
      publicationYear = new Date().getFullYear()
    }

    const bookDataToSave = {
      title: bookData.value.title,
      author: bookData.value.author,
      publicationYear: publicationYear,
      coverImage: coverImageBase64,
      review: review.value,
      rating: rating.value,
      openLibraryId: bookData.value.openLibraryId.trim(),
      coverId: bookData.value.coverId || ''
    }

    console.log('📚 Datos a guardar:', bookDataToSave)

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

// Lifecycle ya no es necesario separarlo, se ha incluido en la inicialización de bookData
</script>
