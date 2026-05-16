<template>
  <div class="min-h-screen watercolor-bg pt-20">
    <!-- Banner -->
    <div class="relative py-16 overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20"
        :style="{ backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663636190019/HrRgiz8vkCidshPFr2vZfR/knowledge-banner-8XoswknvJPy8zbA4Cse9fP.webp)` }"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-light/60 to-light" />
      <div class="container mx-auto max-w-6xl px-4 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span class="font-caveat text-2xl text-primary">成為最棒的主人</span>
            <h1 class="font-nunito font-black text-5xl text-dark mt-2 mb-4">
              寵物照顧
              <br />
              知識中心
            </h1>
            <p class="text-dark/70 font-nunito leading-relaxed max-w-lg">
              領養只是開始，學習如何照顧你的毛孩才是長久之道。
              這裡整理了狗狗和貓咪的完整照顧指南。
            </p>
          </div>
          <div class="relative">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663636190019/HrRgiz8vkCidshPFr2vZfR/knowledge-banner-8XoswknvJPy8zbA4Cse9fP.webp"
              alt="寵物照顧知識"
              class="w-full h-56 object-cover rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto max-w-5xl px-4 py-10">
      <!-- Category Tabs -->
      <div class="flex flex-wrap gap-3 mb-10">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="flex items-center gap-2 px-5 py-2.5 rounded-full font-nunito font-bold text-sm transition-all duration-200"
          :class="activeCategory === cat.id
            ? 'text-white shadow-md scale-105'
            : 'text-dark bg-border hover:bg-border/80'"
          :style="activeCategory === cat.id
            ? { background: `linear-gradient(135deg, ${cat.color}, ${cat.color}CC)` }
            : {}"
        >
          <span class="text-lg">{{ cat.emoji }}</span>
          {{ cat.label }}
        </button>
      </div>

      <!-- Category Header -->
      <div 
        class="card-illustrated p-6 mb-8 flex items-center gap-4"
        :style="{ background: currentCategory.bg, borderColor: currentCategory.color + '30' }"
      >
        <div
          class="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md"
          :style="{ background: currentCategory.color + '20', border: `2px solid ${currentCategory.color}40` }"
        >
          {{ currentCategory.emoji }}
        </div>
        <div>
          <h2 class="font-nunito font-black text-2xl text-dark">
            {{ currentCategory.label }}
          </h2>
          <p class="text-dark/70 text-sm font-nunito">
            共 {{ currentCategory.items.length }} 篇照顧指南
          </p>
        </div>
      </div>

      <!-- Knowledge Cards -->
      <div class="space-y-4">
        <KnowledgeCard
          v-for="item in currentCategory.items"
          :key="item.id"
          :item="item"
          :color="currentCategory.color"
          :bg="currentCategory.bg"
        />
      </div>

      <!-- Quick Reference -->
      <div class="mt-16 card-illustrated p-8">
        <h2 class="font-nunito font-black text-2xl text-dark mb-6 text-center">
          📋 快速參考表
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm font-nunito">
            <thead>
              <tr class="border-b-2 border-border">
                <th class="text-left py-3 px-4 text-dark font-bold">項目</th>
                <th class="text-center py-3 px-4 text-primary font-bold">🐶 狗狗</th>
                <th class="text-center py-3 px-4 text-secondary font-bold">🐱 貓咪</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in referenceTable" :key="row.item" :class="i % 2 === 0 ? 'bg-light' : ''">
                <td class="py-3 px-4 text-dark font-bold">{{ row.item }}</td>
                <td class="py-3 px-4 text-center text-dark/70">{{ row.dog }}</td>
                <td class="py-3 px-4 text-center text-dark/70">{{ row.cat }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12 text-center">
        <p class="font-caveat text-2xl text-primary mb-3">準備好了嗎？</p>
        <h3 class="font-nunito font-black text-3xl text-dark mb-4">
          找到你的完美毛孩夥伴
        </h3>
        <p class="text-dark/70 font-nunito mb-6 max-w-md mx-auto">
          有了這些知識，你已經準備好迎接一隻毛孩了！
          去看看哪些可愛的動物正在等待一個像你一樣的主人。
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import KnowledgeCard from '../components/KnowledgeCard.vue'

const activeCategory = ref('dog')

const categories = [
  { id: 'dog', label: '狗狗照顧', emoji: '🐶', color: '#E8845A', bg: 'rgba(232, 132, 90, 0.08)' },
  { id: 'cat', label: '貓咪照顧', emoji: '🐱', color: '#7BAE7F', bg: 'rgba(123, 174, 127, 0.08)' },
  { id: 'general', label: '通用知識', emoji: '💡', color: '#C3A882', bg: 'rgba(195, 168, 130, 0.1)' },
]

const knowledgeData = {
  dog: [
    {
      id: 'dog-food',
      title: '狗狗的飲食指南',
      summary: '均衡的飲食是狗狗健康的基礎，了解不同年齡的營養需求。',
      icon: '🍖',
      content: [
        '幼犬（0-1歲）：需要高蛋白質、高鈣質的幼犬專用飼料，每天餵食 3-4 次。',
        '成犬（1-7歲）：選擇符合體型的成犬飼料，每天餵食 2 次，保持固定時間。',
        '老犬（7歲以上）：選擇低卡路里、高纖維的老犬飼料，注意關節保健成分。',
      ],
      tips: ['換飼料時要漸進式替換', '不要讓狗狗吃葡萄、洋蔥、巧克力等有毒食物'],
    },
    {
      id: 'dog-exercise',
      title: '運動與遊戲需求',
      summary: '適當的運動讓狗狗保持身心健康，不同品種有不同的運動需求。',
      icon: '🏃',
      content: [
        '小型犬：每天 30-60 分鐘的散步或輕度遊戲即可。',
        '中型犬：每天 1-2 小時的中度運動，包含散步和玩耍。',
        '大型犬/工作犬：每天至少 2 小時的高強度運動。',
      ],
      tips: ['天氣炎熱時避免在正午外出', '散步時讓狗狗自由嗅聞'],
    },
  ],
  cat: [
    {
      id: 'cat-food',
      title: '貓咪的飲食需求',
      summary: '貓咪是肉食性動物，了解牠們獨特的營養需求。',
      icon: '🐟',
      content: [
        '貓咪是嚴格的肉食性動物，需要高蛋白質、適量脂肪的飲食。',
        '乾飼料方便保存，但含水量低；濕食（罐頭）含水量高。',
        '建議乾濕混搭，或提供充足的飲水來源。',
      ],
      tips: ['貓咪容易挑食，可嘗試不同口味', '肥胖是貓咪常見問題'],
    },
    {
      id: 'cat-litter',
      title: '貓砂盆管理',
      summary: '乾淨的貓砂盆是貓咪如廁健康的關鍵。',
      icon: '🏠',
      content: [
        '貓砂盆數量：每隻貓一個，再加一個備用。',
        '位置：安靜、隱密、遠離食水碗。',
        '清潔頻率：每天至少清除結塊一次。',
      ],
      tips: ['觀察貓咪的如廁習慣', '多貓家庭要確保每隻貓都能安心如廁'],
    },
  ],

  general: [
    {
      id: 'first-time',
      title: '新手飼主必讀',
      summary: '第一次養寵物？這些準備工作讓你和毛孩都能順利適應。',
      icon: '🌟',
      content: [
        '領養前評估：考慮你的生活方式、居住空間、時間和經濟能力。',
        '事前準備：在寵物到家前，準備好所有必需品。',
        '適應期：新寵物到家後需要 2-4 週的適應期。',
      ],
      tips: ['閱讀相關書籍或參加寵物照顧課程', '加入飼主社群'],
    },
  ],
}

const currentCategory = computed(() => {
  const cat = categories.find(c => c.id === activeCategory.value)
  return {
    ...cat,
    items: knowledgeData[activeCategory.value] || [],
  }
})

const referenceTable = [
  { item: '餵食次數/天', dog: '2次', cat: '2次' },
  { item: '健康檢查', dog: '每年1次', cat: '每年1次' },
  { item: '每日運動', dog: '30分-2小時', cat: '15-20分鐘互動' },
  { item: '平均壽命', dog: '10-15年', cat: '12-18年' },
]
</script>
