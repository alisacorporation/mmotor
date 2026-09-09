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
      <span class="panel-arrow">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
    <div class="panel-body"><slot /></div>
  </section>
</template>
