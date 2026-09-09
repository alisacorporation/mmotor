<script setup lang="ts">
defineProps<{
  title?: string
  icon?: string
  rows?: number
}>()
</script>

<template>
  <section class="panel">
    <div class="panel-head">
      <span class="panel-icon"><slot name="icon">{{ icon }}</slot></span>
      <h2>{{ title }}</h2>
      <span class="panel-arrow">›</span>
    </div>
    <div class="panel-body"><slot /></div>
  </section>
</template>
