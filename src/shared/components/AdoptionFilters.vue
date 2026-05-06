<template>
  <section class="adoption-filters">
    <div class="adoption-filters__grid">
      <label>
        <span>縣市</span>
        <select :value="filters.county" @change="onSelectChange('county', $event)">
          <option value="">全部縣市</option>
          <option v-for="county in counties" :key="county" :value="county">{{ county }}</option>
        </select>
      </label>

      <label>
        <span>動物種類</span>
        <select :value="filters.kind" @change="onSelectChange('kind', $event)">
          <option value="">全部種類</option>
          <option v-for="kind in kinds" :key="kind" :value="kind">{{ kind }}</option>
        </select>
      </label>

      <label>
        <span>性別</span>
        <select :value="filters.sex" @change="onSelectChange('sex', $event)">
          <option value="">不限</option>
          <option v-for="sex in sexes" :key="sex" :value="sex">{{ sex }}</option>
        </select>
      </label>

      <label>
        <span>體型</span>
        <select :value="filters.bodyType" @change="onSelectChange('bodyType', $event)">
          <option value="">不限</option>
          <option v-for="bodyType in bodyTypes" :key="bodyType" :value="bodyType">{{ bodyType }}</option>
        </select>
      </label>

      <label class="adoption-filters__search">
        <span>關鍵字</span>
        <input
          :value="filters.keyword"
          type="search"
          placeholder="品種、收容所、地點"
          @input="onInputChange('keyword', $event)"
        >
      </label>
    </div>

    <div class="adoption-filters__actions">
      <p>{{ summary }}</p>
      <button type="button" class="text-button" @click="$emit('reset')">清除條件</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AdoptionFilters } from '@/types/adoption';

const props = defineProps<{
  filters: AdoptionFilters;
  counties: string[];
  kinds: string[];
  sexes: string[];
  bodyTypes: string[];
  summary: string;
}>();

const emit = defineEmits<{
  (event: 'update:filters', value: AdoptionFilters): void;
  (event: 'reset'): void;
}>();

function update(key: keyof AdoptionFilters, value: string) {
  emit('update:filters', {
    ...props.filters,
    [key]: value
  });
}

function onSelectChange(key: keyof AdoptionFilters, event: Event) {
  const target = event.target as HTMLSelectElement | null;
  update(key, target?.value ?? '');
}

function onInputChange(key: keyof AdoptionFilters, event: Event) {
  const target = event.target as HTMLInputElement | null;
  update(key, target?.value ?? '');
}
</script>
