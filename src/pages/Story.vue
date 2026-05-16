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
          流浪的終點
        </h1>
        <p class="text-dark/70 font-nunito max-w-lg mx-auto">
          扮演一個流浪者，在黃昏小鎮遇見一隻哭泣的浪狗。
          你的選擇將決定牠的命運。
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
            序幕：流浪者
          </h2>
          <p class="text-dark/70 font-nunito leading-relaxed mb-6 max-w-md mx-auto">
            「別問我的名字，我只是個流浪的人。流浪了多久？我早就忘了。為什麼流浪？因為想遺忘……」
            這天，浪人在黃昏時刻來到了某個郊區小鎮。走著走著，在路邊的垃圾桶旁，他遇見了一隻正在哭泣的流浪狗。
          </p>
        </div>

        <!-- Story Node -->
        <div v-else class="mb-8">
          <div class="mb-6">
            <h3 class="font-nunito font-black text-2xl md:text-3xl text-dark mb-6">
              {{ currentNode.title }}
            </h3>
            <div class="story-text" v-html="formatDialogue(displayedText)"></div>
          </div>
        </div>

        <!-- Choices -->
        <div class="space-y-3">
          <button
            v-for="(choice, index) in currentNode.choices"
            :key="index"
            @click="makeChoice(choice.next)"
            class="w-full p-4 md:p-5 rounded-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all text-left font-nunito text-dark hover:font-bold text-base md:text-lg"
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
            ? '然而我終於明白，生命不分貴賤，都是一樣平等。願每個流浪靈魂的終點，都能夠回到、或重新找到屬於自己的家。\n\n請支持領養代替購買。'
            : currentNode.endingType === 'good'
            ? '浪狗被送到了收容所。在那裡，牠每天都在等待一個新的機會。也許有一天，會有人像你一樣，願意給牠一個永遠的家。'
            : '你繼續了你的旅程，但浪狗的哭聲始終在耳邊迴盪。有些機會，錯過了就不會再來⋯⋯'
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
           🌟 為什麼這個故事很重要？
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
          幫助更多像拉拉一樣的毛孩
        </h3>
        <p class="text-dark/70 font-nunito mb-6 max-w-md mx-auto">
          拉拉的故事只是冰山一角。
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
    title: '序幕：流浪者',
    text: '「別問我的名字，我只是個流浪的人。流浪了多久？我早就忘了。為什麼流浪？因為想遺忘……」\n\n這天，浪人在黃昏時刻來到了某個郊區小鎮。走著走著，在路邊的垃圾桶旁，他遇見了一隻正在哭泣的流浪狗。',
    choices: [
      { text: '💬 上前關心', next: 'meet_dog' },
      { text: '🚶 繼續前進', next: 'walk_away' },
    ],
  },
  walk_away: {
    title: '⋯⋯',
    text: '你邁開腳步，假裝沒聽見那哭泣聲。你告訴自己這不關你的事。但你心裡清楚——你錯過了什麼。',
    choices: [
      { text: '⋯⋯繼續前進', next: 'bad_ending' },
    ],
  },
  meet_dog: {
    title: '相遇',
    text: '浪狗：嗷嗚嗚嗚嗚嗚，嗷嗚～\n\n浪人：小流浪狗啊，你怎麼哭得這麼傷心？\n\n浪狗：今天是我在這等待主人回來接我的第49天。\n\n浪人：49天！？等了這麼久，你還是別等啦！',
    choices: [
      { text: '📖 聽聽牠的故事', next: 'dog_past' },
    ],
  },
  dog_past: {
    title: '浪狗的回憶',
    text: '浪狗：曾經我也是個備受呵護的小王子，我的主人是一對情侶，總是給我吃上好的罐罐，帶我去美容院洗香香。\n\n浪人：那你怎麼會變成現在這副樣子呢？\n\n浪狗：⋯⋯',
    choices: [
      { text: 'A. 我翹家自己跑出來的', next: 'wrong_abandon' },
      { text: 'B. 主人結婚生了小孩，覺得對小孩不好，就不要我了', next: 'correct_abandon' },
      { text: 'C. 我被壞人綁架了', next: 'wrong_abandon' },
    ],
  },
  wrong_abandon: {
    title: '不對⋯⋯',
    text: '浪狗搖了搖頭，眼神中充滿悲傷。不是這樣的，你再想想⋯⋯',
    choices: [
      { text: '🤔 再猜一次', next: 'dog_past' },
    ],
  },
  correct_abandon: {
    title: '令人心碎的真相',
    text: '浪人：什麼！？居然是這樣子，真是太不負責任了！\n\n浪狗：這些日子裡我總在半夜邊哭邊問月亮，是不是我不乖，所以主人不要我⋯⋯\n\n浪人：不是你的錯，是他們沒有準備好承擔一輩子的承諾。',
    choices: [
      { text: '💛 安慰牠', next: 'dog_catchers' },
    ],
  },
  dog_catchers: {
    title: '命運的轉折',
    text: '（一陣吵雜聲響起⋯⋯）\n\n捕狗隊：就是牠！居民舉報的流浪狗！快抓住牠！把牠帶回收容所！\n\n浪狗：嗚嗚⋯⋯（害怕地哀號）\n\n浪人：等等！你們做什麼！把牠抓到收容所，牠會怎麼樣？\n\n捕狗隊：哼哼，你想知道收容所的命運嗎？',
    choices: [
      { text: 'A. 遇到不適任收養人，無法受妥善照顧', next: 'wrong_shelter' },
      { text: 'B. 遇到黑心商人，假領養之名行不法之實', next: 'wrong_shelter' },
      { text: 'C. 若收容所爆量，可能面臨資源不足或安樂死', next: 'correct_shelter' },
    ],
  },
  wrong_shelter: {
    title: '還有更殘酷的⋯⋯',
    text: '捕狗隊：那些都有可能，但最殘酷的是——當收容所空間不夠時，很多健康又親人的狗狗，最後都必須被安樂死。',
    choices: [
      { text: '🤔 再選一次', next: 'dog_catchers' },
    ],
  },
  correct_shelter: {
    title: '挺身而出',
    text: '浪人：怎麼可以這樣！你們別抓牠！牠是我的朋友，以後都由我來照顧！\n\n捕狗隊：好吧！既然你願意負責，那就交給你了。\n\n（捕狗隊離去⋯⋯）',
    choices: [
      { text: '❤️ 給牠一個家', next: 'naming' },
    ],
  },
  naming: {
    title: '新的家人',
    text: '浪狗：謝謝你救了我。\n\n浪人：不用客氣，既然都是流浪，你就跟著我一起吧，我們互相陪伴！那就叫你——拉拉吧！\n\n拉拉：汪汪！（開心地搖著尾巴）',
    choices: [
      { text: '🌟 迎向新旅程', next: 'great_ending' },
    ],
  },
  great_ending: {
    title: '完美結局：回家的路',
    endingType: 'great',
    choices: [],
  },
  good_ending: {
    title: '未完的等待',
    endingType: 'good',
    choices: [],
  },
  bad_ending: {
    title: '遺憾錯過',
    endingType: 'bad',
    choices: [],
  },
}

const currentNode = computed(() => storyNodes[currentNodeId.value] || storyNodes.start)

const endingConfig = {
  great: {
    emoji: '🌟',
    title: '完美結局：回家的路',
  },
  good: {
    emoji: '💛',
    title: '未完的等待',
  },
  bad: {
    emoji: '💙',
    title: '遺憾錯過',
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

const formatDialogue = (text) => {
  if (!text) return ''
  return text.split('\n').map(line => {
    if (line.startsWith('浪狗：')) {
      return `<div class="dialogue-bubble dog"><span class="speaker-tag">🐶 浪狗</span><span class="dialogue-text">${line.slice(3)}</span></div>`
    }
    if (line.startsWith('浪人：')) {
      return `<div class="dialogue-bubble human"><span class="speaker-tag">🧑 浪人</span><span class="dialogue-text">${line.slice(3)}</span></div>`
    }
    if (line.startsWith('捕狗隊：')) {
      return `<div class="dialogue-bubble catcher"><span class="speaker-tag">🚨 捕狗隊</span><span class="dialogue-text">${line.slice(4)}</span></div>`
    }
    if (line.startsWith('拉拉：')) {
      return `<div class="dialogue-bubble dog"><span class="speaker-tag">🐶 拉拉</span><span class="dialogue-text">${line.slice(3)}</span></div>`
    }
    if (line.trim()) {
      return `<div class="narration-line">${line}</div>`
    }
    return ''
  }).join('')
}

const makeChoice = (nextNodeId) => {
  currentNodeId.value = nextNodeId
  displayedText.value = ''

  if (storyNodes[nextNodeId].endingType) {
    gameEnded.value = true
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

<style scoped>
.story-text {
  font-size: 1.1rem;
  line-height: 1.8;
}

.dialogue-bubble {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  border-radius: 1rem;
  font-size: 1.05rem;
  line-height: 1.7;
}

.speaker-tag {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  white-space: nowrap;
}

.dialogue-bubble.dog {
  background: #f0f7ff;
  border-left: 4px solid #60a5fa;
}
.dialogue-bubble.dog .speaker-tag {
  background: #60a5fa;
  color: white;
}

.dialogue-bubble.human {
  background: #f0fdf4;
  border-left: 4px solid #4ade80;
}
.dialogue-bubble.human .speaker-tag {
  background: #4ade80;
  color: white;
}

.dialogue-bubble.catcher {
  background: #fef2f2;
  border-left: 4px solid #f87171;
}
.dialogue-bubble.catcher .speaker-tag {
  background: #f87171;
  color: white;
}

.narration-line {
  padding: 0.5rem 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(0,0,0,0.6);
  font-style: italic;
}
</style>
