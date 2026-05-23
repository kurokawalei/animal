<template>
  <div class="min-h-screen watercolor-bg">
    <!-- Hero Section -->
    <section class="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div class="absolute top-10 right-20 text-6xl opacity-10 animate-float">🐾</div>
      <div class="absolute bottom-10 left-10 text-5xl opacity-10 animate-float-slow">🌿</div>
      
      <div class="container mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <!-- Left Content -->
        <div>
          <span class="font-caveat text-2xl text-primary">領養代替購買</span>
          <h1 class="font-nunito text-5xl md:text-6xl lg:text-7xl font-black text-dark leading-tight mb-6">
            給每一隻
            <span class="text-primary relative">
              毛孩
              <span class="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full" style="transform: translateY(-10px);"></span>
            </span>
            <br />
            一個溫暖的家
          </h1>
          <p class="text-dark/70 font-nunito leading-relaxed max-w-lg mb-8">
            每一隻流浪動物都有自己的故事，都渴望被愛。透過我們的平台，找到你命中注定的毛孩夥伴，一起創造屬於你們的美好故事。
          </p>
          
          <!-- Mini stats -->
          <div class="flex gap-8 mt-10">
            <div v-for="stat in statsPreview" :key="stat.label">
              <div class="font-nunito font-black text-2xl text-primary">
                {{ stat.num }}
              </div>
              <div class="text-xs text-muted font-nunito">{{ stat.label }}</div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap gap-4 mt-10">
            <RouterLink to="/adopt">
              <button class="btn-paw px-8 py-3">
                探索待領養動物 🐾
              </button>
            </RouterLink>
            <RouterLink to="/story">
              <button class="btn-paw-outline px-8 py-3">
                體驗互動故事 📖
              </button>
            </RouterLink>
          </div>
        </div>

        <!-- Right Image -->
        <div class="relative">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663636190019/HrRgiz8vkCidshPFr2vZfR/paw-character-UvegzEbqdjYytA2QXGmaVF.webp"
            alt="小狗角色"
            class="w-full h-auto object-contain animate-float"
          />
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-primary/5">
      <div class="container mx-auto max-w-6xl px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8" ref="statsRef">
          <div 
            v-for="(stat, i) in stats"
            :key="stat.label"
            class="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-md"
            :style="{ transition: `all 0.5s ease ${i * 0.1}s` }"
          >
            <div class="text-4xl mb-3">{{ stat.icon }}</div>
            <div class="font-nunito font-black text-3xl text-primary mb-1">
              {{ statsInView ? animatedCounts[i] : '0' }}
            </div>
            <div class="font-nunito text-sm text-dark/70">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-border/40" ref="featuresRef">
      <div class="container mx-auto max-w-6xl px-4">
        <div class="text-center mb-14">
          <span class="font-caveat text-2xl text-primary">我們提供</span>
          <h2 class="font-nunito font-black text-4xl md:text-5xl text-dark mt-2">
            完整的領養旅程
          </h2>
          <p class="text-dark/70 mt-4 max-w-xl mx-auto font-nunito">
            從找到心儀的毛孩，到學習如何成為最棒的主人，我們陪你走每一步。
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="feature in features"
            :key="feature.title"
            class="card-illustrated p-6 text-center hover:scale-105 transition-transform"
          >
            <div class="text-5xl mb-4">{{ feature.icon }}</div>
            <h3 class="font-nunito font-bold text-lg text-dark mb-2">{{ feature.title }}</h3>
            <p class="text-dark/70 text-sm font-nunito">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Adopt vs Buy Section -->
    <section class="py-20 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <img 
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663636190019/HrRgiz8vkCidshPFr2vZfR/adopt-vs-buy-cLDJBGxfLPvvXEcYmVeKKL.webp"
          alt="背景"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
      </div>

      <div class="container mx-auto max-w-6xl px-4 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            ref="adoptVsBuyRef"
            :style="{ 
              opacity: adoptVsBuyVisible ? 1 : 0,
              transform: adoptVsBuyVisible ? 'translateX(0)' : 'translateX(-50px)',
              transition: 'all 0.7s ease',
            }"
          >
            <span class="font-caveat text-2xl text-primary">為什麼選擇領養？</span>
            <h2 class="font-nunito font-black text-4xl md:text-5xl text-dark mt-2 mb-6">
              領養，
              <br />
              <span class="text-secondary">不購買</span>
            </h2>

            <div class="space-y-4">
              <div v-for="reason in reasons" :key="reason" class="flex gap-4 items-start">
                <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-primary font-bold">✓</span>
                </div>
                <p class="text-dark/70 font-nunito">{{ reason }}</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="card-illustrated p-8 bg-gradient-to-br from-primary/10 to-secondary/10">
              <img 
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80&auto=format&fit=crop"
                alt="領養的毛孩"
                class="w-full h-64 object-cover rounded-2xl mb-6"
              />
              <div class="absolute -bottom-4 -left-4 bg-primary text-white rounded-2xl px-5 py-3 shadow-xl">
                <div class="font-nunito font-black text-lg">領養 = 愛</div>
                <div class="font-caveat text-sm opacity-90">Adopt with love 🐾</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-accent">
      <div class="absolute top-0 right-0 text-8xl opacity-10 animate-float">🐾</div>
      <div class="absolute bottom-0 left-0 text-7xl opacity-10 animate-float-slow">🌿</div>
      
      <div class="container mx-auto max-w-3xl px-4 text-center relative z-10">
        <span class="font-caveat text-3xl text-white/80 block mb-3">
          牠們在等你
        </span>
        <h2 class="font-nunito font-black text-4xl md:text-5xl text-white mb-6">
          今天，就成為
          <br />
          某隻毛孩的全世界
        </h2>
        <p class="text-white/90 font-nunito max-w-lg mx-auto mb-8">
          每一隻流浪動物都在等待一個機會，等待被愛。你的一個決定，可能改變一隻毛孩的一生。
        </p>
        <RouterLink to="/adopt">
          <button class="bg-white text-primary px-10 py-4 rounded-full font-nunito font-bold hover:shadow-xl transition-all hover:scale-105">
            立即開始領養 🏠
          </button>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const statsPreview = [
  { num: '2,847', label: '成功領養' },
  { num: '156', label: '合作收容所' },
  { num: '98%', label: '領養滿意度' },
]

const stats = [
  { icon: '🐾', num: 2847, label: '成功領養' },
  { icon: '🏠', num: 156, label: '合作收容所' },
  { icon: '💛', num: 98, label: '領養滿意度%' },
]

const features = [
  { icon: '🔍', title: '智能匹配', desc: '根據你的生活方式找到最適合的毛孩' },
  { icon: '📚', title: '照顧指南', desc: '完整的寵物照顧知識和建議' },
  { icon: '🎮', title: '互動故事', desc: '透過遊戲了解領養的意義' },
  { icon: '💬', title: '社群支持', desc: '與其他領養者分享經驗和建議' },
]

const reasons = [
  '拯救一隻生命，給流浪動物第二次機會',
  '領養的動物通常更懂得珍惜家庭',
  '支持動物保護，反對不道德的繁殖',
  '節省開支，將資源用於動物照顧',
  '每隻領養的動物都是獨特的個體',
]

const statsRef = ref(null)
const featuresRef = ref(null)
const adoptVsBuyRef = ref(null)

const statsInView = ref(false)
const adoptVsBuyVisible = ref(false)
const animatedCounts = ref([0, 0, 0])

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target === statsRef.value && entry.isIntersecting) {
        statsInView.value = true
        animateNumbers()
      }
      if (entry.target === adoptVsBuyRef.value && entry.isIntersecting) {
        adoptVsBuyVisible.value = true
      }
    })
  }, { threshold: 0.1 })

  if (statsRef.value) observer.observe(statsRef.value)
  if (adoptVsBuyRef.value) observer.observe(adoptVsBuyRef.value)
})

const animateNumbers = () => {
  const targets = [2847, 156, 98]
  const duration = 2000
  const start = Date.now()

  const animate = () => {
    const elapsed = Date.now() - start
    const progress = Math.min(elapsed / duration, 1)

    animatedCounts.value = targets.map(target => Math.floor(target * progress))

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}
</script>
