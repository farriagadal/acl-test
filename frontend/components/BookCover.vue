<template>
  <div class="book-cover-container">
    <img
      v-if="isLoaded && imageUrl"
      :src="imageUrl"
      :alt="alt"
      :class="cssClass"
      @error="handleImageError"
    />
    <div v-else-if="isError || !imageUrl" :class="cssClass">
      Sin portada disponible
    </div>
    <div v-else class="loading-cover" :class="cssClass">
      Cargando...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'

const props = defineProps({
  src: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: 'Portada de libro'
  },
  cssClass: {
    type: String,
    default: 'book-cover'
  },
  bookId: {
    type: String,
    default: null
  }
})

const imageUrl = ref(null)
const isLoaded = ref(false)
const isError = ref(false)
const api = useApi()

const loadImage = async () => {
  isLoaded.value = false
  isError.value = false

  try {
    // Caso 1: Es una URL de la API local para una portada guardada
    if (props.src && props.src.includes('/api/books/library/front-cover/')) {
      const bookId = props.src.split('/').pop()
      try {
        const response = await api.get(`/api/books/library/front-cover/${bookId}`)
        if (response && response.image) {
          imageUrl.value = response.image
          isLoaded.value = true
        } else {
          throw new Error('Formato de respuesta inválido')
        }
      } catch (error) {
        console.error('Error cargando imagen de libro:', error)
        isError.value = true
      }
    }
    // Caso 2: Es un data:image URL directo (base64)
    else if (props.src && props.src.startsWith('data:image')) {
      imageUrl.value = props.src
      isLoaded.value = true
    }
    // Caso 3: Es una URL externa (OpenLibrary)
    else if (props.src) {
      imageUrl.value = props.src
      isLoaded.value = true
    } 
    // Caso 4: No hay imagen
    else {
      isError.value = true
    }
  } catch (error) {
    console.error('Error procesando imagen:', error)
    isError.value = true
  }
}

// Cargar imagen cuando el componente se monta o src cambia
watch(() => props.src, loadImage, { immediate: true })

const handleImageError = () => {
  console.warn('Error cargando imagen:', props.src)
  isError.value = true
}

onMounted(() => {
  if (!isLoaded.value && !isError.value) {
    loadImage()
  }
})
</script>

<style scoped>
.book-cover-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  color: #666;
  font-size: 0.8em;
}
</style>
