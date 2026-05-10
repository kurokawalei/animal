<template>
  <div
    class="card-illustrated overflow-hidden transition-all duration-300"
    :style="{ borderColor: color + '25', backgroundColor: bg }"
  >
    <!-- Header -->
    <button
      @click="expanded = !expanded"
      class="w-full p-5 text-left flex items-start gap-4"
    >
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
        :style="{ backgroundColor: color + '20', borderColor: color + '30', borderWidth: '2px', borderStyle: 'solid' }"
      >
        {{ item.icon }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-nunito font-bold text-lg text-dark mb-1">{{ item.title }}</h3>
        <p class="text-dark/70 text-sm font-nunito leading-relaxed">{{ item.summary }}</p>
      </div>
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300"
        :style="{ backgroundColor: color + '15', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }"
      >
        <span class="text-sm" :style="{ color: color }">▼</span>
      </div>
    </button>

    <!-- Expanded Content -->
    <div v-if="expanded" class="px-5 pb-5 border-t" :style="{ borderColor: color + '20' }">
      <div class="pt-4 space-y-2">
        <div v-for="(point, i) in item.content" :key="i" class="flex gap-3 items-start">
          <div
            class="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold"
            :style="{ backgroundColor: color + '20', color: color }"
          >
            {{ i + 1 }}
          </div>
          <p class="text-dark/70 text-sm font-nunito leading-relaxed">{{ point }}</p>
        </div>
      </div>

      <div v-if="item.tips" class="mt-4 p-4 rounded-xl" :style="{ backgroundColor: color + '10', borderColor: color + '25', borderWidth: '1.5px', borderStyle: 'solid' }">
        <h4 class="font-nunito font-bold text-sm mb-2" :style="{ color: color }">
          💡 小提示
        </h4>
        <ul class="space-y-1">
          <li v-for="(tip, i) in item.tips" :key="i" class="text-sm font-nunito flex gap-2 text-muted">
            <span>•</span>
            <span>{{ tip }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  bg: {
    type: String,
    required: true,
  },
})

const expanded = ref(false)
</script>
