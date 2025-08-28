<template>
  <div>
    <LoginForm />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // Si ya está autenticado, redirigir a la página principal
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})
</script>
