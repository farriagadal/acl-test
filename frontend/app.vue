<template>
  <div>
    <header class="main-header">
      <div class="header-content">
        <AppTitle />
        <div class="header-actions">
          <UserMenu />
        </div>
      </div>
    </header>
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import AppTitle from '~/components/AppTitle.vue'
import UserMenu from '~/components/UserMenu.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Inicializar autenticación
  authStore.initAuth()
})
</script>

<style>
.main-header {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
