<template>
  <header class="section-heading">
    <p v-if="kicker" class="section-heading__kicker">{{ kicker }}</p>
    <h2>{{ title }}</h2>
    <p v-if="description" class="section-heading__description">{{ description }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  kicker?: string;
  description?: string;
}>();
</script>
