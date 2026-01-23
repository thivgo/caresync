<script setup>
import { defineAsyncComponent } from 'vue'

const SectionHero = defineAsyncComponent(() => import('../components/SectionHero.vue'))
const SectionDark = defineAsyncComponent(() => import('../components/SectionDark.vue'))
</script>

<template>
  <div>
    <SectionHero />
    <SectionDark />
  </div>
</template>