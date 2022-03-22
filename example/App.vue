<script setup lang="ts">
import Variation from "./components/Variation.vue";
const variations = [{ name: "颜色", options: ["red", "green", "blue"] }];
</script>

<template>
  <div>
    <Variation v-for="(variation, index) of variations" :key="index" :value="variation" />
  </div>
</template>
