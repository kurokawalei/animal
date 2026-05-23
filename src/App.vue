<template>
  <div id="app" class="flex flex-col min-h-screen">
    <ParticleBackground />
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />

    <div class="fixed bottom-16 right-4 md:bottom-8 md:right-8 z-50" @click="showMessage">
      <div class="mascot-wrapper group cursor-pointer select-none">
        <Transition name="bubble">
          <div v-if="bubbleVisible" class="speech-bubble">
            {{ currentMessage }}
          </div>
        </Transition>
        <svg viewBox="0 0 120 130" class="mascot-svg w-20 h-22 md:w-28 md:h-30">
          <ellipse cx="50" cy="88" rx="28" ry="22" fill="#E8A87C" class="body-part" />
          <g class="tail-group">
            <path d="M76 80 Q92 65 95 50" stroke="#E8A87C" stroke-width="7" stroke-linecap="round" fill="none" />
          </g>
          <ellipse cx="32" cy="105" rx="10" ry="6" fill="#D4956A" />
          <ellipse cx="68" cy="105" rx="10" ry="6" fill="#D4956A" />
          <circle cx="50" cy="48" r="26" fill="#E8A87C" class="head-part" />
          <g class="ear-left">
            <ellipse cx="28" cy="32" rx="9" ry="16" fill="#D4956A" transform="rotate(-12 28 32)" />
            <ellipse cx="28" cy="34" rx="5" ry="9" fill="#C4845A" transform="rotate(-12 28 34)" />
          </g>
          <g class="ear-right">
            <ellipse cx="72" cy="32" rx="9" ry="16" fill="#D4956A" transform="rotate(12 72 32)" />
            <ellipse cx="72" cy="34" rx="5" ry="9" fill="#C4845A" transform="rotate(12 72 34)" />
          </g>
          <g class="eyes">
            <ellipse cx="39" cy="46" rx="4.5" ry="5.5" fill="#3D2B1F" />
            <ellipse cx="61" cy="46" rx="4.5" ry="5.5" fill="#3D2B1F" />
            <circle cx="41" cy="43.5" r="1.8" fill="white" />
            <circle cx="63" cy="43.5" r="1.8" fill="white" />
          </g>
          <ellipse cx="50" cy="54" rx="4" ry="3" fill="#3D2B1F" />
          <path d="M45 58 Q50 63 55 58" stroke="#3D2B1F" stroke-width="2" fill="none" stroke-linecap="round" />
          <ellipse cx="32" cy="54" rx="5" ry="3" fill="#FFB5B5" opacity="0.5" />
          <ellipse cx="68" cy="54" rx="5" ry="3" fill="#FFB5B5" opacity="0.5" />
          <ellipse cx="35" cy="100" rx="9" ry="5" fill="#E8A87C" />
          <ellipse cx="65" cy="100" rx="9" ry="5" fill="#E8A87C" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ParticleBackground from './components/ParticleBackground.vue'

const messages = [
  '帶我回家好嗎？🐾',
  '你來了！我等好久～',
  '領養代替購買！',
  '摸摸頭～❤️',
  '今天也是好天氣！',
  '汪！你最好啦～',
  '想要一個家⋯⋯',
]

const currentMessage = ref('')
const bubbleVisible = ref(false)
let timer = null

const showMessage = () => {
  if (timer) clearTimeout(timer)
  currentMessage.value = messages[Math.floor(Math.random() * messages.length)]
  bubbleVisible.value = true
  timer = setTimeout(() => {
    bubbleVisible.value = false
  }, 3000)
}
</script>

<style scoped>
#app {
  background: linear-gradient(135deg, #FDF8F0 0%, #F5E6D3 50%, #FDF8F0 100%);
}

.mascot-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mascot-svg {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
  transition: filter 0.3s;
}

.mascot-wrapper:hover .mascot-svg {
  filter: drop-shadow(0 6px 16px rgba(232, 168, 124, 0.4));
}

.mascot-wrapper:hover .ear-left {
  animation: perk-ear-left 0.4s ease-out forwards;
}

.mascot-wrapper:hover .ear-right {
  animation: perk-ear-right 0.4s ease-out forwards;
}

.speech-bubble {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #3D2B1F;
  padding: 8px 14px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.speech-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: white;
}

.bubble-enter-active,
.bubble-leave-active {
  transition: all 0.3s ease;
}

.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.bubble-leave-to {
  transform: translateX(-50%) translateY(-10px);
}

.tail-group {
  animation: wag 0.6s ease-in-out infinite;
  transform-origin: 76px 80px;
}

.body-part {
  animation: breathe 3s ease-in-out infinite;
}

.head-part {
  animation: breathe 3s ease-in-out infinite 0.1s;
}

@keyframes wag {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(15deg); }
}

@keyframes breathe {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1.5px); }
}

@keyframes perk-ear-left {
  0% { transform: rotate(-12deg); }
  100% { transform: rotate(-5deg); }
}

@keyframes perk-ear-right {
  0% { transform: rotate(12deg); }
  100% { transform: rotate(5deg); }
}
</style>
