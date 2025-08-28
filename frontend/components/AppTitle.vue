<template>
  <div class="logo">
    <h1 @click="goToHome" class="app-title">📚 Biblioteca ACL Test</h1>
  </div>
</template>

<script setup>
const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.app-title {
  color: white;
  margin: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.app-title:hover {
  transform: scale(1.05);
}
</style>
