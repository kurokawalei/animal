<template>
  <div class="page-shell story-page">
    <SiteHeader />

    <main class="story-runway">
      <section class="story-opening">
        <div class="story-opening__copy">
          <p class="eyebrow eyebrow--warm">互動故事</p>
          <h1>這不是一篇故事，而是一段和浪浪慢慢靠近的過程。</h1>
          <p class="lead">
            你會先進入現場、做出選擇，再看見選擇如何改變你和牠的距離。這裡保留敘事，但節奏像一場輕量的視覺小說。
          </p>
          <div class="hero-actions">
            <button class="primary-button" type="button" @click="startStory">進入故事</button>
            <a class="ghost-button" href="/adopt.html">直接去找浪浪</a>
          </div>
          <div class="story-signals">
            <span>點擊推進</span>
            <span>輕量分歧</span>
            <span>結尾導流</span>
          </div>
        </div>

        <div class="story-opening__poster">
          <div class="poster-board poster-board--dusk">
            <img class="poster-board__bg" src="/images/space_1.jpg" alt="故事背景">
            <img class="poster-board__figure poster-board__figure--boy" src="/images/boy.svg" alt="浪人角色">
            <img class="poster-board__figure poster-board__figure--dog" src="/images/y-dog-sad.svg" alt="浪狗角色">
            <img class="poster-board__figure poster-board__figure--cat" src="/images/cat_1.svg" alt="浪貓角色">
          </div>
          <div class="poster-note">
            <strong>像遊戲，但不靠複雜系統。</strong>
            <p>只有對話、選擇與進度，讓你把注意力放在動物和責任上。</p>
          </div>
        </div>
      </section>

      <section class="content-section story-stage-wrap">
        <div class="story-stage-head">
          <SectionHeading
            kicker="Chapter 01"
            title="和牠說幾句話"
            description="每個選擇會累積 trust 值，最後影響結局與導流內容。"
          />

          <div class="story-meter">
            <div class="story-meter__chip">
              <span>信任值</span>
              <strong>{{ trust }}</strong>
            </div>
            <div class="story-meter__bar">
              <span :style="{ width: `${progress * 100}%` }"></span>
            </div>
            <p>{{ currentNode.sceneLabel }}</p>
          </div>
        </div>

        <div class="story-stage" :class="`story-stage--${currentNode.scene}`">
          <div class="story-stage__art">
            <transition name="fade-soft" mode="out-in">
              <img :key="currentNode.id" :src="currentNode.portrait" :alt="currentNode.speaker">
            </transition>
            <div class="story-stage__glow"></div>
            <div class="story-stage__tag">{{ currentNode.sceneLabel }}</div>
          </div>

          <div class="story-stage__dialogue">
            <transition name="dialogue" mode="out-in">
              <article :key="currentNode.id" class="dialogue-card">
                <p class="dialogue-card__speaker">{{ currentNode.speaker }}</p>
                <h2>{{ currentNode.title }}</h2>
                <p class="dialogue-card__text">{{ currentNode.text }}</p>
                <p class="dialogue-card__hint">{{ currentNode.hint }}</p>

                <div v-if="currentNode.kind === 'choice' && currentNode.choices" class="choice-grid">
                  <button
                    v-for="choice in currentNode.choices"
                    :key="choice.label"
                    class="choice-card"
                    type="button"
                    @click="choose(choice)"
                  >
                    <strong>{{ choice.label }}</strong>
                    <span>{{ choice.note }}</span>
                  </button>
                </div>

                <div v-else-if="currentNode.kind === 'ending'" class="ending-panel">
                  <strong>{{ endingTitle }}</strong>
                  <p>{{ endingText }}</p>
                </div>

                <div v-else class="chapter-controls">
                  <button class="primary-button" type="button" @click="advance">
                    {{ currentNode.nextLabel || '下一段' }}
                  </button>
                </div>
              </article>
            </transition>
          </div>

          <aside class="story-journal">
            <div class="story-journal__head">
              <p>對話紀錄</p>
              <button type="button" class="text-button" @click="restart">重新開始</button>
            </div>

            <div class="story-journal__list">
              <article v-for="entry in journal" :key="entry.key" class="journal-entry">
                <span>{{ entry.speaker }}</span>
                <p>{{ entry.text }}</p>
              </article>
            </div>

            <div class="story-journal__route">
              <strong>故事走向</strong>
              <p>{{ routeHint }}</p>
            </div>
          </aside>
        </div>
      </section>

      <section class="content-section">
        <SectionHeading
          kicker="下一步"
          title="把故事轉成行動"
          description="故事結束後，不要停在情緒，直接進入領養探索或自評。"
        />

        <div class="story-actions story-actions--wide">
          <a class="primary-button" href="/adopt.html">前往領養探索</a>
          <a class="ghost-button" href="/test.html">先做領養自評</a>
          <button class="ghost-button ghost-button--dark" type="button" @click="restart">再看一次故事</button>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import SiteHeader from '@/shared/components/SiteHeader.vue';
import SiteFooter from '@/shared/components/SiteFooter.vue';
import SectionHeading from '@/shared/components/SectionHeading.vue';
import { storyNodes, storyOrder, type StoryChoice, type StoryNode } from '@/data/storyArc';

interface JournalEntry {
  key: string;
  speaker: string;
  text: string;
}

const currentId = ref(storyNodes[0].id);
const trust = ref(1);
const journal = ref<JournalEntry[]>([]);
const completed = ref(false);

const nodeMap = new Map<string, StoryNode>(storyNodes.map((node) => [node.id, node]));

const currentNode = computed(() => nodeMap.get(currentId.value) ?? storyNodes[0]);
const progress = computed(() => {
  const index = storyOrder.indexOf(currentId.value);
  return index < 0 ? 0 : (index + 1) / storyOrder.length;
});
const endingTitle = computed(() => {
  if (trust.value >= 3) {
    return '願意陪伴，才是真的準備好';
  }
  if (trust.value >= 2) {
    return '你已經在靠近，只差最後的確認';
  }
  return '先別急，先把準備做完整';
});
const endingText = computed(() => {
  if (trust.value >= 3) {
    return '你的選擇已經把同情變成責任。下一步，去領養探索頁找一隻真正適合你的浪浪。';
  }
  if (trust.value >= 2) {
    return '你已經有很好的方向，但還可以再確認時間、家人共識和照護方式，再開始領養。';
  }
  return '故事帶來了感受，但領養需要更多準備。先看自評或領養知識，再回來找牠。';
});
const routeHint = computed(() => {
  if (completed.value) {
    return '結局已經打開，直接轉去領養探索最順。';
  }
  if (trust.value >= 3) {
    return '你正在走向「可以領養」的結局。';
  }
  if (trust.value >= 2) {
    return '你已經開始理解牠們，下一步是檢查自己的準備度。';
  }
  return '先把故事看完，再去做自評會更剛好。';
});

function pushJournal(node: StoryNode, note?: string) {
  const text = note ?? node.text;
  const last = journal.value[journal.value.length - 1];
  if (last?.speaker === node.speaker && last.text === text) {
    return;
  }
  journal.value.push({
    key: `${node.id}-${journal.value.length}`,
    speaker: node.speaker,
    text
  });
}

function goTo(id: string) {
  const nextNode = nodeMap.get(id);
  if (!nextNode) {
    return;
  }
  currentId.value = id;
  completed.value = nextNode.kind === 'ending';
  pushJournal(nextNode);
}

function startStory() {
  restart();
  pushJournal(currentNode.value);
}

function advance() {
  const nextId = currentNode.value.nextId;
  if (nextId) {
    goTo(nextId);
  }
}

function choose(choice: StoryChoice) {
  trust.value += choice.trustDelta;
  pushJournal(currentNode.value, `${choice.label} · ${choice.note}`);
  goTo(choice.nextId);

  if (choice.nextId === 'shelter-scene') {
    completed.value = false;
  }
}

function restart() {
  currentId.value = storyNodes[0].id;
  trust.value = 1;
  journal.value = [];
  completed.value = false;
  nextTick(() => pushJournal(currentNode.value));
}

onMounted(() => {
  restart();
});
</script>
