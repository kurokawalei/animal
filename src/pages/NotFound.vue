<template>
  <div class="min-h-screen watercolor-bg flex items-center justify-center pt-20">
    <div class="text-center px-4">
      <img
        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663636190019/HrRgiz8vkCidshPFr2vZfR/paw-character-UvegzEbqdjYytA2QXGmaVF.webp"
        alt="找不到頁面"
        class="w-48 h-48 object-contain mx-auto mb-6 animate-float opacity-80"
      />
      <span class="font-caveat text-2xl text-primary block mb-2">迷路了嗎？</span>
      <h1 class="font-nunito font-black text-6xl text-dark mb-4">404</h1>
      <p class="text-dark/70 font-nunito mb-8 max-w-sm mx-auto">
        這個頁面好像跑去流浪了...
        讓我們帶你回到安全的地方。
      </p>
      <RouterLink to="/">
        <button class="btn-paw px-8 py-3">
          回到首頁 🏠
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
