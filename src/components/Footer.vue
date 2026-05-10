<template>
  <footer class="bg-dark text-light py-16">
    <div class="container mx-auto max-w-6xl px-4">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span class="text-white text-lg">🐾</span>
            </div>
            <div>
              <span class="font-nunito font-black text-xl text-light block">
                Paw & Home
              </span>
              <span class="font-caveat text-sm text-primary">
                給毛孩一個家
              </span>
            </div>
          </div>
          <p class="text-light/70 text-sm font-nunito">
            我們相信每隻流浪動物都值得擁有一個溫暖的家。領養代替購買，讓愛延續。
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-nunito font-bold text-light mb-4">快速連結</h4>
          <ul class="space-y-2">
            <li><RouterLink to="/" class="text-light/70 hover:text-primary transition">首頁</RouterLink></li>
            <li><RouterLink to="/adopt" class="text-light/70 hover:text-primary transition">領養動物</RouterLink></li>
            <li><RouterLink to="/story" class="text-light/70 hover:text-primary transition">互動故事</RouterLink></li>
            <li><RouterLink to="/care" class="text-light/70 hover:text-primary transition">照顧知識</RouterLink></li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="font-nunito font-bold text-light mb-4">資源</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-light/70 hover:text-primary transition">常見問題</a></li>
            <li><a href="#" class="text-light/70 hover:text-primary transition">領養指南</a></li>
            <li><a href="#" class="text-light/70 hover:text-primary transition">聯絡我們</a></li>
            <li><a href="#" class="text-light/70 hover:text-primary transition">隱私政策</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-nunito font-bold text-light mb-4">聯絡方式</h4>
          <div class="space-y-2 text-sm text-light/70">
            <p>📧 hello@pawadopt.com</p>
            <p>📱 0800-000-000</p>
            <p>🕐 週一至週五 10:00-18:00</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="border-t border-light/20 pt-12 mb-12">
        <div class="grid grid-cols-3 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-3">
            <span class="font-nunito font-black text-primary text-xl">
              {{ stat.num }}
            </span>
            <span class="text-light/70 text-sm font-nunito">
              {{ stat.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-light/20 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-light/60 text-sm font-nunito">
          © 2026 Paw & Home. 給毛孩一個家。
        </p>
        <div class="flex gap-4 mt-4 md:mt-0">
          <a href="#" class="text-light/70 hover:text-primary transition">Facebook</a>
          <a href="#" class="text-light/70 hover:text-primary transition">Instagram</a>
          <a href="#" class="text-light/70 hover:text-primary transition">Twitter</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const stats = [
  { num: '2,847', label: '成功領養' },
  { num: '156', label: '合作收容所' },
  { num: '98%', label: '領養滿意度' },
]
</script>
