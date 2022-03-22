<script setup lang="ts">
import { getUuid } from "../utils";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({
      name: "",
      options: [],
    }),
  },
});
const emit = defineEmits(['add:item'])
const addOption = () => {
  const { options } = props.value;
  const addItem = {
    uid: getUuid(),
    value: "",
    selected: false,
  };
  options.push(addItem);
  emit('add:item',addItem);

};
</script>
<template>
  <div style="border: 1px solid black; display: flex">
    <div style="width: calc(100% - 24px)">
      <div>name: <input v-model="value.name" /></div>
      <div>
        options:
        <span v-for="(option, index) of value.options" :key="index" class="ml-2">
          <input v-model="option.selected" type="checkbox" />
          <input v-model="option.value" />
        </span>
        <button @click="addOption" class="ml-2">+</button>
      </div>
    </div>
    <div style="width: 24px">
      <button @click="$emit('remove')" style="width: 100%; height: 100%">-</button>
    </div>
  </div>
</template>

<style scoped>
.ml-2 {
  margin-left: 2px;
}
</style>
