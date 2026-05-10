<template>
  <div class="min-h-screen watercolor-bg pt-20">
    <!-- Banner -->
    <div class="relative py-16 overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20"
        :style="{ backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663636190019/HrRgiz8vkCidshPFr2vZfR/game-bg-2TbVvPWvJKhPvGjLhVHhfE.webp)` }"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-light/80 via-light/60 to-light" />
      <div class="container mx-auto max-w-4xl px-4 text-center relative z-10">
        <span class="font-caveat text-2xl text-primary">互動劇情故事</span>
        <h1 class="font-nunito font-black text-5xl text-dark mt-2 mb-4">
          小白的旅程
        </h1>
        <p class="text-dark/70 font-nunito max-w-lg mx-auto">
          扮演一隻流浪狗，體驗從街頭到家的旅程。
          你的選擇將決定小白的未來。
        </p>
      </div>
    </div>

    <div class="container mx-auto max-w-4xl px-4 py-10">
      <!-- Story Container -->
      <div v-if="!gameEnded" class="card-illustrated p-8 md:p-12">
        <!-- Character Intro -->
        <div v-if="currentNodeId === 'start'" class="text-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663636190019/HrRgiz8vkCidshPFr2vZfR/paw-character-UvegzEbqdjYytA2QXGmaVF.webp"
            alt="小白"
            class="w-40 h-40 object-contain mx-auto mb-6 animate-float"
          />
          <h2 class="font-nunito font-black text-3xl text-dark mb-4">
            遇見小白
          </h2>
          <p class="text-dark/70 font-nunito leading-relaxed mb-6 max-w-md mx-auto">
            小白是一隻在台北街頭流浪的白色小狗。
            牠每天都在尋找食物和溫暖的地方睡覺。
            今天，你遇見了牠。你會怎麼做？
          </p>
        </div>

        <!-- Story Node -->
        <div v-else class="mb-8">
          <div class="mb-6">
            <h3 class="font-nunito font-black text-2xl text-dark mb-4">
              {{ currentNode.title }}
            </h3>
            <p class="text-dark/70 font-nunito leading-relaxed whitespace-pre-line">
              {{ displayedText }}
            </p>
          </div>
        </div>

        <!-- Choices -->
        <div class="space-y-3">
          <button
            v-for="(choice, index) in currentNode.choices"
            :key="index"
            @click="makeChoice(choice.next)"
            class="w-full p-4 rounded-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all text-left font-nunito text-dark hover:font-bold"
          >
            {{ choice.text }}
          </button>
        </div>
      </div>

      <!-- Ending Screen -->
      <div v-else class="card-illustrated p-8 md:p-12 text-center">
        <div class="text-4xl mb-3">
          {{ endingConfig[currentNode.endingType]?.emoji }}
        </div>
        <h3 class="font-nunito font-black text-2xl mb-2">
          {{ endingConfig[currentNode.endingType]?.title }}
        </h3>
        <p class="font-nunito text-sm opacity-90 mb-6 whitespace-pre-line leading-relaxed">
          {{ currentNode.endingType === 'great'
            ? '小白找到了一個充滿愛的家。每天早上，牠都會用舔舐和搖尾巴來歡迎你。你的決定改變了牠的人生。'
            : currentNode.endingType === 'good'
            ? '小白被送到了一個溫暖的收容所，在那裡牠會等待下一個家庭。你的善心為牠開啟了新的希望。'
            : '小白仍然在街頭流浪，但牠記得你的溫暖。也許下次，你能給牠一個永遠的家。'
          }}
        </p>
        <button
          @click="resetGame"
          class="btn-paw px-8 py-3"
        >
          重新開始 🔄
        </button>
      </div>

      <!-- Why Adopt Section -->
      <div class="mt-16 card-illustrated p-8">
        <h2 class="font-nunito font-black text-2xl text-dark mb-6 text-center">
          🌟 為什麼小白的故事很重要？
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="point in whyAdopt" :key="point.title" class="text-center">
            <div class="text-4xl mb-3">{{ point.emoji }}</div>
            <h4 class="font-nunito font-bold text-dark mb-2">{{ point.title }}</h4>
            <p class="text-dark/70 text-sm font-nunito">{{ point.desc }}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12 text-center">
        <p class="font-caveat text-2xl text-primary mb-3">準備好了嗎？</p>
        <h3 class="font-nunito font-black text-3xl text-dark mb-4">
          幫助更多像小白一樣的毛孩
        </h3>
        <p class="text-dark/70 font-nunito mb-6 max-w-md mx-auto">
          小白的故事只是冰山一角。
          還有數千隻流浪動物在等待像你一樣的人。
        </p>
        <RouterLink to="/adopt">
          <button class="btn-paw px-8 py-3">
            探索待領養動物 🐾
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'

const currentNodeId = ref('start')
const displayedText = ref('')
const gameEnded = ref(false)

const storyNodes = {
  start: {
    title: '遇見小白',
    text: '小白是一隻在台北街頭流浪的白色小狗。牠每天都在尋找食物和溫暖的地方睡覺。今天，你遇見了牠。你會怎麼做？',
    choices: [
      { text: '🏠 邀請小白回家', next: 'adopt' },
      { text: '🏥 帶小白去獸醫檢查', next: 'vet' },
      { text: '🍖 先給小白一些食物', next: 'feed' },
    ],
  },
  adopt: {
    title: '小白回家了',
    text: '你決定邀請小白回家。小白第一次進入一個溫暖的家，牠在沙發上蜷縮起來，感到前所未有的安全感。',
    choices: [
      { text: '❤️ 給小白最好的照顧', next: 'great_ending' },
      { text: '😕 發現照顧很困難', next: 'bad_ending' },
    ],
  },
  vet: {
    title: '健康檢查',
    text: '你帶小白去獸醫診所。獸醫檢查後說小白很健康，只是需要好好休息和營養。',
    choices: [
      { text: '❤️ 決定自己照顧小白', next: 'great_ending' },
      { text: '🏠 幫小白找到一個家', next: 'good_ending' },
    ],
  },
  feed: {
    title: '第一頓飯',
    text: '小白狼吞虎嚥地吃著你給的食物。吃完後，牠抬起頭，用感激的眼神看著你。',
    choices: [
      { text: '❤️ 這就是我的毛孩了', next: 'great_ending' },
      { text: '🤔 我需要更多時間考慮', next: 'good_ending' },
    ],
  },
  great_ending: {
    title: '完美結局',
    endingType: 'great',
    choices: [],
  },
  good_ending: {
    title: '未完待續',
    endingType: 'good',
    choices: [],
  },
  bad_ending: {
    title: '遺憾的選擇',
    endingType: 'bad',
    choices: [],
  },
}

const currentNode = computed(() => storyNodes[currentNodeId.value] || storyNodes.start)

const endingConfig = {
  great: {
    emoji: '🌟',
    title: '完美結局',
  },
  good: {
    emoji: '💛',
    title: '未完待續',
  },
  bad: {
    emoji: '💙',
    title: '遺憾的選擇',
  },
}

const whyAdopt = [
  {
    emoji: '❤️',
    title: '拯救生命',
    desc: '每一次領養，都是拯救一隻生命，給流浪動物第二次機會。',
  },
  {
    emoji: '🏥',
    title: '減少繁殖',
    desc: '領養可以減少不道德的寵物繁殖，改善動物福利。',
  },
  {
    emoji: '💪',
    title: '改變世界',
    desc: '你的選擇能改變一隻動物的人生，也能啟發他人。',
  },
]

const makeChoice = (nextNodeId) => {
  currentNodeId.value = nextNodeId
  displayedText.value = ''
  
  if (storyNodes[nextNodeId].endingType) {
    gameEnded.value = true
  } else {
    typewriterEffect()
  }
}

const typewriterEffect = () => {
  const text = currentNode.value.text
  displayedText.value = ''
  let index = 0

  const interval = setInterval(() => {
    if (index < text.length) {
      displayedText.value += text[index]
      index++
    } else {
      clearInterval(interval)
    }
  }, 30)
}

const resetGame = () => {
  currentNodeId.value = 'start'
  displayedText.value = ''
  gameEnded.value = false
}

watch(currentNodeId, () => {
  if (!gameEnded.value) {
    typewriterEffect()
  }
})
</script>
