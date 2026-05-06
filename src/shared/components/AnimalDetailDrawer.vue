<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="animal" class="animal-drawer" @click.self="$emit('close')">
        <section class="animal-drawer__panel">
          <button type="button" class="animal-drawer__close" @click="$emit('close')">×</button>

          <div class="animal-drawer__layout">
            <img class="animal-drawer__image" :src="animal.imageUrl" :alt="animal.title" @error="fallbackImage">

            <div class="animal-drawer__content">
              <p class="animal-drawer__eyebrow">{{ animal.county }} · {{ animal.kind }}</p>
              <h3>{{ animal.title }}</h3>

              <div class="animal-drawer__badges">
                <span>{{ animal.sex }}</span>
                <span>{{ animal.bodyType }}</span>
                <span>{{ animal.status }}</span>
              </div>

              <dl class="animal-drawer__facts">
                <div><dt>品種</dt><dd>{{ animal.variety }}</dd></div>
                <div><dt>年紀</dt><dd>{{ animal.age }}</dd></div>
                <div><dt>所在地</dt><dd>{{ animal.place }}</dd></div>
                <div><dt>收容所</dt><dd>{{ animal.shelterName }}</dd></div>
                <div><dt>電話</dt><dd>{{ animal.shelterTel || '未提供' }}</dd></div>
                <div><dt>地址</dt><dd>{{ animal.shelterAddress || '未提供' }}</dd></div>
                <div><dt>開放認養</dt><dd>{{ animal.openDate }}</dd></div>
                <div><dt>疫苗 / 結紮</dt><dd>{{ animal.bacterin }} / {{ animal.sterilization }}</dd></div>
              </dl>

              <p class="animal-drawer__caption">{{ animal.caption || animal.remark || '請直接聯絡收容所，確認最新認養條件。' }}</p>

              <div class="animal-drawer__actions">
                <a class="pill-button" :href="animal.officialUrl" target="_blank" rel="noopener">官方認養入口</a>
                <a v-if="telHref" class="pill-button pill-button--ghost" :href="telHref">撥打收容所電話</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AnimalRecord } from '@/types/adoption';
import { buildTelHref } from '@/services/adoptionApi';

const props = defineProps<{
  animal: AnimalRecord | null;
}>();

defineEmits<{
  (event: 'close'): void;
}>();

const telHref = computed(() => (props.animal ? buildTelHref(props.animal.shelterTel) : ''));

function fallbackImage(event: Event) {
  const target = event.target as HTMLImageElement | null;
  if (target) {
    target.src = '/images/ap.jpg';
  }
}
</script>
