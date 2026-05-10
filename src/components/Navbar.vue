<template>
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
    <div class="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3 group hover:opacity-80 transition">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <span class="text-white text-lg">🐾</span>
        </div>
        <div>
          <span class="font-nunito font-black text-xl text-dark leading-none block">
            Paw & Home
          </span>
          <span class="font-caveat text-xs text-primary leading-none">
            給毛孩一個家
          </span>
        </div>
      </RouterLink>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-1">
        <RouterLink 
          v-for="link in navLinks" 
          :key="link.href"
          :to="link.href"
          class="px-4 py-2 rounded-full font-nunito font-semibold text-sm transition-all duration-200"
          :class="isActive(link.href) 
            ? 'bg-primary text-white shadow-md' 
            : 'text-dark hover:bg-border hover:text-primary'"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- CTA Button -->
      <button class="hidden md:block btn-paw px-6 py-2 text-sm">
        立即領養 🐾
      </button>

      <!-- Mobile Menu Toggle -->
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden w-10 h-10 rounded-full hover:bg-border transition flex items-center justify-center"
      >
        <span class="text-xl">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-light border-t border-border py-4 px-2 rounded-b-2xl shadow-lg">
      <RouterLink 
        v-for="link in navLinks" 
        :key="link.href"
        :to="link.href"
        class="block px-4 py-3 rounded-xl font-nunito font-semibold text-sm mb-1 transition-all"
        :class="isActive(link.href) 
          ? 'bg-primary text-white' 
          : 'text-dark hover:bg-border'"
        @click="mobileMenuOpen = false"
      >
        {{ link.label }}
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { href: '/', label: '首頁' },
  { href: '/adopt', label: '領養動物' },
  { href: '/story', label: '互動故事' },
  { href: '/care', label: '照顧知識' },
]

const isActive = (href) => {
  return route.path === href
}
</script>
