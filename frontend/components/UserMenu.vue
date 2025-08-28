<template>
  <div class="user-menu">
    <button v-if="isLoggedIn" @click="goToMyLibrary" class="library-btn">Mi Biblioteca</button>
    <div v-if="isLoggedIn" class="user-info">
      <button @click="logout" class="logout-btn">Cerrar sesión</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Getters del store
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Detectar la página actual
const isHomePage = computed(() => route.path === '/')
const isMyLibraryPage = computed(() => route.path === '/my-library')

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}

const goToMyLibrary = () => {
  router.push('/my-library')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
  color: white;
}

.logout-btn {
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c53030;
}

.login-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #2980b9;
}

.library-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 1rem;
}

.library-btn:hover {
  background-color: #27ae60;
}

.home-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 1rem;
}

.home-btn:hover {
  background-color: #2980b9;
}
</style>
