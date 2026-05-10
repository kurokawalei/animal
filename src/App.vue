<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
#app {
  background: linear-gradient(135deg, #FDF8F0 0%, #F5E6D3 50%, #FDF8F0 100%);
}
</style>
