<template>
  <div class="page-shell test-page">
    <SiteHeader />

    <main class="test-runway">
      <section class="test-opening">
        <div class="test-opening__copy">
          <p class="eyebrow eyebrow--warm">領養自評</p>
          <h1>先確認準備度，再決定要不要領養。</h1>
          <p class="lead">
            這不是考試，而是一段幫你把時間、金錢、照護與心理準備整理好的旅程。
          </p>
          <div class="hero-actions">
            <button class="primary-button" type="button" @click="submitQuiz">直接檢查</button>
            <a class="ghost-button" href="/story.html">先看故事</a>
          </div>
        </div>

        <div class="test-opening__panel">
          <img src="/images/test_01.jpg" alt="領養自評">
          <div class="test-opening__panel-note">
            <strong>四個問題，判斷你現在適不適合開始找浪浪。</strong>
          </div>
        </div>
      </section>

      <section class="content-section">
        <SectionHeading kicker="快速檢查" title="四題自我檢核" description="回答完後，系統會直接告訴你現在適合往哪一步走。" />

        <form class="quiz-form" @submit.prevent="submitQuiz">
          <fieldset v-for="(question, index) in quizQuestions" :key="question.id" class="quiz-card">
            <legend>
              <span>Q{{ index + 1 }}</span>
              {{ question.prompt }}
            </legend>
            <label v-for="(option, optionIndex) in question.options" :key="option">
              <input v-model="answers[question.id]" type="radio" :name="question.id" :value="optionIndex">
              <span>{{ option }}</span>
            </label>
          </fieldset>

          <button class="primary-button" type="submit">查看結果</button>
        </form>

        <div v-if="result" class="result-card">
          <h3>{{ result.title }}</h3>
          <p>{{ result.description }}</p>
          <div class="story-actions">
            <a class="primary-button" href="/adopt.html">去找浪浪</a>
            <a class="ghost-button" href="/story.html">再看故事</a>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import SiteHeader from '@/shared/components/SiteHeader.vue';
import SiteFooter from '@/shared/components/SiteFooter.vue';
import SectionHeading from '@/shared/components/SectionHeading.vue';
import { quizQuestions } from '@/data/quiz';

const answers = reactive<Record<string, number | undefined>>({});
const score = ref(0);
const submitted = ref(false);

const result = computed(() => {
  if (!submitted.value) {
    return null;
  }

  if (score.value >= 3) {
    return {
      title: '準備度高，可以進入領養探索',
      description: '你對陪伴與照護已有明確想法，下一步可以直接用篩選頁找合適的浪浪。'
    };
  }

  if (score.value >= 2) {
    return {
      title: '還差一步，建議先補充資訊',
      description: '你的方向不錯，但還可以再確認生活節奏、預算與家人共識。'
    };
  }

  return {
    title: '先別急，建議先看故事與知識',
    description: '目前還不適合直接領養，先透過故事與自評建立更穩定的認知。'
  };
});

function submitQuiz() {
  submitted.value = true;
  score.value = quizQuestions.reduce((total, question) => {
    return total + (answers[question.id] === question.answer ? 1 : 0);
  }, 0);
}
</script>
