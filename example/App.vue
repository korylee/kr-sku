<script setup lang="ts">
import { ComputedRef, Ref, ref } from '@vue/reactivity';
import Variation from './components/Variation.vue';
import type { Variation as VariationData, VariationSku } from '@korylee/sku';
import { useVariationOption } from '@korylee/sku';
import { getUuid } from './utils';
import { computed } from '@vue/runtime-core';
import { log } from 'console';
import { calcDescartes } from '../src/utils';

const backendVariations = [{ name: '颜色', options: ['red', 'green', 'blue'] }];
const variations: Ref<VariationData[]> = ref([]);
const filteredVariations: ComputedRef<VariationData[]> = computed(() => {
  return variations.value.filter(({ options }) => options?.length);
});
variations.value = backendVariations.map(
  (variation) =>
    ({
      name: variation.name,
      options: variation.options.map((option) => ({
        uid: getUuid(),
        value: option,
        selected: false,
      })),
      uid: '',
    } as unknown as VariationData)
);
const skuItems: Ref<VariationSku[]> = ref([]);
const {
  add: addItem,
  remove: removeItem,
  descartesUidArray,
} = useVariationOption(
  filteredVariations,
  skuItems,
  undefined,
  undefined,
  false
);
const addVariation = () => {
  variations.value.push({
    name: Date.now(),
    options: [],
  } as unknown as VariationData);
};
const removeVariation = (index: number) => {
  variations.value.splice(index, 1);
  removeItem();
};
const skuHeaders = computed(() => {
  return filteredVariations.value;
});
console.time('progress')
console.timeLog('progress',calcDescartes([Array.from({length: 50}),Array.from({length: 50}),Array.from({length: 50})]))
console.timeEnd('progress')
</script>

<template>
  <div>
    <Variation
      v-for="(variation, index) of variations"
      :key="index"
      :value="variation"
      @add:item="addItem"
      @remove="removeVariation(index)"
    />
    <button @click="addVariation" style="width: 100%">+</button>
    <table style="margin-top: 30px">
      <caption>
        sku 列表{{skuItems.length}}
      </caption>
      <tbody>
        <tr>
          <th scope="col" v-for="(header, index) of skuHeaders" :key="index">
            {{ header.name }}
          </th>
          <th scope="col">库存</th>
        </tr>
        <tr v-for="(skuItem, index) of skuItems" :key="index">
          <th scope="row" v-for="option of skuItem.options" :key="option.uid">
            <input v-model="option.value" />
          </th>
          <td>
            <input v-model="skuItem.stock" type="number" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
