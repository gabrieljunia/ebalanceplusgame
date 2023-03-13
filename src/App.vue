<script setup lang="ts">
  import { useGameParametersStore } from '../src/stores/GameParametersStore';
  import TheNavBar from './layout/TheNavBar.vue';
</script>

<template>
  <main class="application" :class="useGameParametersStore().theme">
    <TheNavBar />
    <RouterView />
  </main>
</template>

<style lang="scss">
  @import './styles/global.scss';
</style>
