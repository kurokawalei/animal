<template>
  <div class="page-shell adopt-page">
    <SiteHeader />

    <main>
      <section class="adopt-hero">
        <div class="adopt-hero__copy">
          <p class="eyebrow">全台官方領養資料</p>
          <h1>先找到合適的牠，再談領養。</h1>
          <p class="lead">
            用縣市、種類、性別、體型與關鍵字快速搜尋，直接查看收容所電話與官方認養入口。
          </p>
          <div class="hero-actions">
            <a class="primary-button" href="#adoption-panel">開始搜尋</a>
            <a class="ghost-button" href="/story.html">先看故事</a>
          </div>
        </div>

        <div class="adopt-hero__card">
          <strong>{{ animals.length }}</strong>
          <span>筆官方資料</span>
          <ul>
            <li>每日更新的農業部資料</li>
            <li>卡片、詳情、撥號一次完成</li>
            <li>支援手機與桌機瀏覽</li>
          </ul>
        </div>
      </section>

      <section id="adoption-panel" class="content-section">
        <SectionHeading
          kicker="快速篩選"
          title="尋找浪浪"
          description="先縮小範圍，再看詳情，能更快找到適合你的毛孩。"
        />

        <AdoptionFilters
          :filters="filters"
          :counties="counties"
          :kinds="kinds"
          :sexes="sexes"
          :bodyTypes="bodyTypes"
          :summary="summary"
          @update:filters="setFilters"
          @reset="resetFilters"
        />

        <div v-if="loading" class="status-banner">正在載入官方資料...</div>
        <div v-else-if="warning" class="status-banner status-banner--warning">{{ warning }}</div>

        <div v-if="filteredAnimals.length" class="animal-grid">
          <AnimalCard
            v-for="animal in filteredAnimals"
            :key="animal.id"
            :animal="animal"
            @select="selectedAnimal = animal"
          />
        </div>

        <div v-else class="empty-state">
          <h3>找不到符合條件的浪浪</h3>
          <p>可以先清除篩選條件，或改用更寬鬆的條件再試一次。</p>
          <button type="button" class="primary-button" @click="resetFilters">回到全部資料</button>
        </div>
      </section>

      <section class="content-section">
        <SectionHeading kicker="領養流程" title="四個步驟，把想法變行動" />
        <div class="step-grid">
          <article class="step-card">
            <span>01</span>
            <h3>先看資料</h3>
            <p>用篩選器找出生活條件符合的動物。</p>
          </article>
          <article class="step-card">
            <span>02</span>
            <h3>看詳情</h3>
            <p>確認所在地、收容所與開放認養時間。</p>
          </article>
          <article class="step-card">
            <span>03</span>
            <h3>直接聯絡</h3>
            <p>打電話或前往官方入口詢問認養流程。</p>
          </article>
          <article class="step-card">
            <span>04</span>
            <h3>準備迎接</h3>
            <p>確認家中條件、預算與家人共識。</p>
          </article>
        </div>
      </section>
    </main>

    <SiteFooter />

    <AnimalDetailDrawer :animal="selectedAnimal" @close="selectedAnimal = null" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import SiteHeader from '@/shared/components/SiteHeader.vue';
import SiteFooter from '@/shared/components/SiteFooter.vue';
import SectionHeading from '@/shared/components/SectionHeading.vue';
import AdoptionFilters from '@/shared/components/AdoptionFilters.vue';
import AnimalCard from '@/shared/components/AnimalCard.vue';
import AnimalDetailDrawer from '@/shared/components/AnimalDetailDrawer.vue';
import type { AnimalRecord } from '@/types/adoption';
import { useAdoptionAnimals } from '@/composables/useAdoptionAnimals';

const {
  animals,
  filters,
  loading,
  warning,
  counties,
  kinds,
  sexes,
  bodyTypes,
  filteredAnimals,
  summary,
  resetFilters,
  setFilters,
  hydrateFilters
} = useAdoptionAnimals();

const selectedAnimal = ref<AnimalRecord | null>(null);

onMounted(() => {
  hydrateFilters(new URLSearchParams(window.location.search));
});

watch(filters, () => {
  if (selectedAnimal.value && !filteredAnimals.value.includes(selectedAnimal.value)) {
    selectedAnimal.value = null;
  }
}, { deep: true });
</script>
