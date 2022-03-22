<script setup lang="ts">
defineProps({
  value: {
    type: Object,
    default: () => ({
      name: "",
      options: [],
    }),
  },
});
</script>
<template>
  <div style="border: 1px solid black">
    <div>name: {{ value.name }}</div>
    <div>
      options:
      <button v-for="(option, index) of value.options" :key="index" class="ml-2">{{ option }}</button>
      <button class="ml-2">+</button>
    </div>
  </div>
</template>

<style scoped>
.ml-2{
  margin-left: 2px;
}
</style>