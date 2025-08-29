<template>
  <div class="pagination">
    <!-- Información de página -->
    <div class="pagination-info">
      Página {{ pagination.page }} de {{ pagination.totalPages || 1 }}
      <span class="total-results">({{ pagination.totalResults }} resultados)</span>
    </div>
    
    <!-- Controles de paginación -->
    <div class="pagination-controls">
      <!-- Botón Anterior -->
      <button 
        class="page-button prev" 
        :disabled="!pagination.hasPrevPage || loading" 
        @click="onPrevPage"
      >
        <span class="page-icon">←</span> 
        <span class="page-text">Anterior</span>
      </button>
      
      <!-- Botón Siguiente -->
      <button 
        class="page-button next" 
        :disabled="!pagination.hasNextPage || loading" 
        @click="onNextPage"
      >
        <span class="page-text">Siguiente</span> 
        <span class="page-icon">→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pagination: {
    type: Object,
    required: true,
    default: () => ({
      page: 1,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false,
      totalResults: 0,
      totalPages: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['prev-page', 'next-page'])

const onPrevPage = () => {
  if (props.pagination.hasPrevPage && !props.loading) {
    emit('prev-page')
  }
}

const onNextPage = () => {
  if (props.pagination.hasNextPage && !props.loading) {
    emit('next-page')
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.pagination-info {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.total-results {
  color: #95a5a6;
  font-size: 0.85rem;
}

.pagination-controls {
  display: flex;
  gap: 1rem;
}

.page-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.page-button:hover {
  background-color: #2980b9;
}

.page-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.page-icon {
  font-weight: bold;
}

@media (max-width: 480px) {
  .page-text {
    display: none;
  }
  
  .page-button {
    padding: 0.5rem 0.75rem;
  }
}
</style>
