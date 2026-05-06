<template>
  <article class="animal-card" @click="$emit('select', animal)">
    <div class="animal-card__media">
      <img :src="animal.imageUrl" :alt="animal.title" loading="lazy" @error="fallbackImage">
      <span class="animal-card__county">{{ animal.county }}</span>
    </div>

    <div class="animal-card__body">
      <div class="animal-card__heading">
        <h3>{{ animal.title }}</h3>
        <p>{{ animal.variety }}</p>
      </div>

      <div class="animal-card__badges">
        <span>{{ animal.sex }}</span>
        <span>{{ animal.bodyType }}</span>
        <span>{{ animal.status }}</span>
      </div>

      <dl class="animal-card__facts">
        <div>
          <dt>年紀</dt>
          <dd>{{ animal.age }}</dd>
        </div>
        <div>
          <dt>收容所</dt>
          <dd>{{ animal.shelterName }}</dd>
        </div>
      </dl>

      <div class="animal-card__actions">
        <button type="button" class="pill-button">看詳情</button>
        <a
          v-if="telHref"
          class="pill-button pill-button--ghost"
          :href="telHref"
          @click.stop
        >
          聯絡收容所
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { AnimalRecord } from '@/types/adoption';
import { buildTelHref } from '@/services/adoptionApi';

const props = defineProps<{
  animal: AnimalRecord;
}>();

defineEmits<{
  (event: 'select', animal: AnimalRecord): void;
}>();

const telHref = buildTelHref(props.animal.shelterTel);

function fallbackImage(event: Event) {
  const target = event.target as HTMLImageElement | null;
  if (target) {
    target.src = '/images/ap.jpg';
  }
}
</script>
