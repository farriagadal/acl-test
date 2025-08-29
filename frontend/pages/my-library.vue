<template>
  <div class="app-container">
    <!-- Contenido principal -->
    <main class="main-content">
      <div class="my-library">
        <!-- Header de la biblioteca -->
        <div class="library-header">
          <h2 class="library-title">Mi Biblioteca</h2>
          <button class="back-btn" @click="goToHome">
            ← Volver al Inicio
          </button>
        </div>

        <!-- Filtros -->
        <div class="library-filters">
          <div class="filters-grid">
            <div class="filter-group">
              <label>Buscar por título o autor</label>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Buscar..."
                @input="applyFilters"
              />
            </div>
            
            <div class="filter-group">
              <label>Filtrar por calificación</label>
              <select v-model="filters.rating" @change="applyFilters">
                <option value="">Todas las calificaciones</option>
                <option value="5">5 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="2">2 estrellas</option>
                <option value="1">1 estrella</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Ordenar por</label>
              <select v-model="filters.sortBy" @change="applyFilters">
                <option value="">Más recientes primero</option>
                <option value="rating-desc">Calificación descendente</option>
                <option value="rating-asc">Calificación ascendente</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>
                <input
                  v-model="filters.excludeNoReview"
                  type="checkbox"
                  @change="applyFilters"
                />
                Excluir libros sin review
              </label>
            </div>
          </div>
        </div>

        <!-- Lista de libros -->
        <div class="library-books">
          <div v-if="loading" class="loading">
            Cargando biblioteca...
          </div>
          
          <div v-else-if="myLibrary.length === 0" class="error-message">
            No tienes libros en tu biblioteca aún
          </div>
          
          <div v-else class="books-grid">
            <div
              v-for="book in myLibrary"
              :key="book._id"
              class="library-book-card"
            >
              <BookCover
                :src="book.coverImage"
                :alt="book.title"
                css-class="book-cover"
              />
              
              <div class="book-content">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author }}</p>
                
                <div class="book-rating">
                  <span>Calificación:</span>
                  <div class="stars">
                    <span v-for="star in 5" :key="star">
                      {{ star <= book.rating ? '★' : '☆' }}
                    </span>
                  </div>
                </div>
                
                <p v-if="book.review" class="book-review">
                  <strong>Review:</strong> {{ book.review }}
                </p>
                <p v-else class="book-review">
                  <em>Sin review</em>
                </p>
                
                <div class="book-actions">
                  <button class="edit-btn" @click="editBook(book)">
                    Editar
                  </button>
                  <button class="delete-btn" @click="confirmDelete(book)">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal" @click.stop>
        <h3 class="modal-title">Confirmar eliminación</h3>
        <p class="modal-message">
          ¿Estás seguro de que quieres eliminar "{{ bookToDelete?.title }}" de tu biblioteca?
          Esta acción no se puede deshacer.
        </p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="closeDeleteModal">
            Cancelar
          </button>
          <button class="confirm-btn" @click="deleteBook" :disabled="deleting">
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal edit-modal" @click.stop>
        <h3 class="modal-title">Editar libro</h3>
        
        <form @submit.prevent="updateBook">
          <div class="form-group">
            <label>Calificación</label>
            <div class="rating-input">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ active: star <= editForm.rating }"
                @click="editForm.rating = star"
              >
                ★
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label>Review</label>
            <textarea
              v-model="editForm.review"
              class="review-textarea"
              placeholder="Escribe tu opinión sobre este libro..."
              maxlength="500"
            ></textarea>
            <div class="char-count">
              {{ editForm.review.length }}/500 caracteres
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeEditModal">
              Cancelar
            </button>
            <button type="submit" class="confirm-btn" :disabled="updating">
              {{ updating ? 'Actualizando...' : 'Actualizar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="showSuccessMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBooksStore } from '~/stores/books'
import BookCover from '~/components/BookCover.vue'
import AppTitle from '~/components/AppTitle.vue'

// Store
const booksStore = useBooksStore()

// Estado local
const filters = ref({
  search: '',
  rating: '',
  sortBy: '',
  excludeNoReview: false
})

const showDeleteModal = ref(false)
const showEditModal = ref(false)
const bookToDelete = ref(null)
const deleting = ref(false)
const updating = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')

const editForm = ref({
  rating: 0,
  review: ''
})

// Computed properties
const myLibrary = computed(() => booksStore.myLibrary)
const loading = computed(() => booksStore.loading)

// Métodos
const applyFilters = () => {
  booksStore.loadMyLibrary(filters.value)
}

const editBook = (book) => {
  editForm.value = {
    rating: book.rating,
    review: book.review || ''
  }
  bookToDelete.value = book
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  bookToDelete.value = null
  editForm.value = { rating: 0, review: '' }
}

const updateBook = async () => {
  if (!editForm.value.rating) {
    alert('Por favor selecciona una calificación')
    return
  }

  updating.value = true

  try {
    const result = await booksStore.updateBook(bookToDelete.value._id, {
      rating: editForm.value.rating,
      review: editForm.value.review
    })

    if (result.success) {
      showSuccessMessage.value = true
      successMessage.value = 'Libro actualizado exitosamente'
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
      closeEditModal()
    } else {
      alert(`Error: ${result.error}`)
    }
  } catch (error) {
    console.error('Error actualizando libro:', error)
    alert('Error al actualizar el libro')
  } finally {
    updating.value = false
  }
}

const confirmDelete = (book) => {
  bookToDelete.value = book
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  bookToDelete.value = null
}

const deleteBook = async () => {
  if (!bookToDelete.value) return

  deleting.value = true

  try {
    const result = await booksStore.deleteBook(bookToDelete.value._id)

    if (result.success) {
      showSuccessMessage.value = true
      successMessage.value = 'Libro eliminado exitosamente'
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
      closeDeleteModal()
    } else {
      alert(`Error: ${result.error}`)
    }
  } catch (error) {
    console.error('Error eliminando libro:', error)
    alert('Error al eliminar el libro')
  } finally {
    deleting.value = false
  }
}

const goToHome = () => {
  navigateTo('/')
}

// Lifecycle
onMounted(async () => {
  await booksStore.loadMyLibrary()
})
</script>

<style scoped>
.edit-modal {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.rating-input {
  display: flex;
  gap: 0.5rem;
}

.star {
  font-size: 2rem;
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s ease;
}

.star.active {
  color: #f39c12;
}

.star:hover {
  color: #f39c12;
}

.review-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  font-size: 0.9rem;
  resize: vertical;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #95a5a6;
  margin-top: 0.5rem;
}
</style>
