<template>
  <div class="page-shell home-page">
    <SiteHeader />

    <main class="home-runway">
      <section class="home-opening">
        <div class="home-opening__copy">
          <p class="eyebrow eyebrow--warm">流浪不是結局</p>
          <h1>把故事、領養與判斷，放進同一個沉浸式入口。</h1>
          <p class="lead">
            這裡不是傳統的資訊網站，而是一條從情緒、故事到行動的路。先看見牠，再決定你能不能成為牠的家。
          </p>
          <div class="hero-actions">
            <a class="primary-button" href="/story.html">進入故事</a>
            <a class="ghost-button" href="/adopt.html">開始找浪浪</a>
          </div>

          <div class="home-signal">
            <div>
              <strong>{{ animalCount }}</strong>
              <span>官方資料</span>
            </div>
            <div>
              <strong>全台</strong>
              <span>可篩選來源</span>
            </div>
            <div>
              <strong>輕量</strong>
              <span>對話式故事</span>
            </div>
          </div>
        </div>

        <div class="home-opening__stage">
          <div class="poster-rack">
            <div class="poster-rack__main">
              <img src="/images/bn.jpg" alt="主視覺">
              <div class="poster-rack__label">今晚先遇見牠們</div>
            </div>
            <div class="poster-rack__side poster-rack__side--top">
              <img src="/images/y-dog.svg" alt="浪狗">
            </div>
            <div class="poster-rack__side poster-rack__side--bottom">
              <img src="/images/cat.svg" alt="浪貓">
            </div>
          </div>

          <div class="orbital-card orbital-card--warm">
            <span>導覽節奏</span>
            <strong>先故事，再領養，最後自評</strong>
          </div>
          <div class="orbital-card orbital-card--calm">
            <span>視覺風格</span>
            <strong>沉浸式、分鏡感、帶點繪本氣質</strong>
          </div>
        </div>
      </section>

      <section class="content-section">
        <SectionHeading
          kicker="三個門"
          title="不是三張卡片，而是三條不同的進入方式"
          description="每個入口都對應不同的心情與任務，不是單純重複的 CTA。"
        />

        <div class="chapter-lanes">
          <article class="chapter-card chapter-card--story">
            <p class="chapter-card__eyebrow">Story Route</p>
            <h2>先看故事</h2>
            <p>像進入一段視覺小說，先和浪狗、浪貓說幾句話，再決定下一步。</p>
            <a href="/story.html">進入劇情</a>
          </article>

          <article class="chapter-card chapter-card--adopt">
            <p class="chapter-card__eyebrow">Adopt Route</p>
            <h2>直接找浪浪</h2>
            <p>用官方資料快速篩選、比較、聯絡收容所，立刻縮短找到牠的路。</p>
            <a href="/adopt.html">開始探索</a>
          </article>

          <article class="chapter-card chapter-card--quiz">
            <p class="chapter-card__eyebrow">Check Route</p>
            <h2>先做自評</h2>
            <p>如果還不確定自己準備好了沒，先用幾個問題確認照護節奏。</p>
            <a href="/test.html">前往自評</a>
          </article>
        </div>
      </section>

      <section class="content-section">
        <SectionHeading
          kicker="目前角色"
          title="這些孩子正在等一個不會再消失的家"
          description="卡片像角色檔案，不像制式商品列表。"
        />

        <div class="cast-rail">
          <AnimalCard
            v-for="animal in featuredAnimals"
            :key="animal.id"
            class="cast-card"
            :animal="animal"
            @select="openAnimal"
          />
        </div>
      </section>

      <section class="content-section home-bridge">
        <div class="home-bridge__copy">
          <p class="eyebrow eyebrow--warm">下一步</p>
          <h2>看完故事，不要停在情緒上。</h2>
          <p>
            你可以先去領養探索頁找一隻適合自己的孩子，也可以先做自評確認自己是否準備好了。
          </p>
        </div>
        <div class="home-bridge__actions">
          <a class="primary-button" href="/adopt.html">直接找浪浪</a>
          <a class="ghost-button" href="/test.html">先做自評</a>
        </div>
      </section>
    </main>

    <SiteFooter />

    <AnimalDetailDrawer :animal="selectedAnimal" @close="selectedAnimal = null" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SiteHeader from '@/shared/components/SiteHeader.vue';
import SiteFooter from '@/shared/components/SiteFooter.vue';
import SectionHeading from '@/shared/components/SectionHeading.vue';
import AnimalCard from '@/shared/components/AnimalCard.vue';
import AnimalDetailDrawer from '@/shared/components/AnimalDetailDrawer.vue';
import { useAdoptionAnimals } from '@/composables/useAdoptionAnimals';
import type { AnimalRecord } from '@/types/adoption';

const { animals } = useAdoptionAnimals();
const selectedAnimal = ref<AnimalRecord | null>(null);

const animalCount = computed(() => animals.value.length);
const featuredAnimals = computed(() => animals.value.slice(0, 3));

function openAnimal(animal: AnimalRecord) {
  selectedAnimal.value = animal;
}
</script>
