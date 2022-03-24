import { calcDescartes, isSimilarArray, noop, wrapInArray } from "./utils";
import type { Ref, ComputedRef } from "vue-demi";
import { computed } from "vue-demi";

export type Uid = string | number;
interface VariationOption {
  uid: Uid;
  selected?: boolean;
  [p: string]: any;
}

export interface Variation {
  uid?: Uid;
  name: string;
  options: VariationOption[];
}

export function getDescartesOptions(variations: Variation[]): VariationOption[][] {
  const optionsArray = variations
    .filter(({ options }) => options?.length)
    .map(({ options }) => options);
  return calcDescartes(optionsArray);
}

type UpdateItemFn<T> = (item: T, options: VariationOption[], variations: Variation[]) => void;

export interface VariationSku {
  [p: string]: any;
  options: VariationOption[];
}

const getUids = (options: VariationOption[]) => options.map((option) => option.uid);

export function removeVariationOption<T extends VariationSku>(
  items: T[],
  {
    variations,
    descartesOptions,
    updateItem = noop,
  }: {
    variations: Variation[];
    descartesOptions?: VariationOption[][];
    needSort?: boolean;
    updateItem?: UpdateItemFn<T>;
  }
): void {
  const removeIndex: number[] = [];
  const memo: boolean[] = [];
  descartesOptions = descartesOptions ?? getDescartesOptions(variations);
  items.forEach((variationTableItem, index) => {
    let res = true;
    (descartesOptions as VariationOption[][]).forEach((options, index) => {
      const result = isSimilarArray(options, variationTableItem.options);
      if (result) {
        if (!memo[index]) res = false;
        variationTableItem.options = options;
        updateItem?.(variationTableItem, options, variations);
        memo[index] = true;
      }
    });
    if (res) removeIndex.push(index);
  });
  const len = removeIndex.length;
  for (let i = len - 1; i >= 0; i--) {
    const item = removeIndex[i];
    items.splice(item, 1);
  }
}

export function addVariationOption<T extends VariationSku>(
  items: T[],
  {
    variations,
    descartesOptions,
    createItem = (options) => ({ options } as T),
    updateItem = noop,
    addItems = [],
  }: {
    variations: Variation[];
    descartesOptions?: VariationOption[][];
    createItem?: (options: VariationOption[], variations: Variation[]) => T;
    updateItem?: UpdateItemFn<T>;
    addItems?: Variation[];
  }
): void {
  descartesOptions = descartesOptions ?? getDescartesOptions(variations);
  descartesOptions.forEach((options) => {
    const findIndex = items.findIndex((variationTableItem) => {
      const res = isSimilarArray(variationTableItem.options, options);
      if (res) {
        variationTableItem.options = options;
        updateItem?.(variationTableItem, options, variations);
      }
      return res;
    });
    if (findIndex !== -1) return;
    const isContain = addItems?.length
      ? options.some(({ uid }) => addItems.some((item) => uid === item.uid))
      : true;
    if (!isContain) return;
    const addItem = createItem(options, variations);
    items.push(addItem);
  });
}

export function uidsToIndex(uids: Uid[], variations: Variation[]): number[] {
  return uids.map((uid, index) =>
    variations[index].options.findIndex((option) => option.uid === uid)
  );
}

export function sortVariationOption(items: VariationSku[], variations: Variation[]) {
  items.sort(
    (a, b) =>
      parseInt(uidsToIndex(getUids(a.options), variations).join("")) -
      parseInt(uidsToIndex(getUids(b.options), variations).join(""))
  );
}

const DescartesOptionsWeakMap = new WeakMap<Ref<Variation[]>, ComputedRef<VariationOption[][]>>();

export function useVariationOption<T extends VariationSku>(
  variations: Ref<Variation[]>,
  variationSkus: Ref<T[]>,
  createItem?: (options: VariationOption[], variations: Variation[]) => T,
  updateItem?: UpdateItemFn<T>,
  needSort: boolean = true
) {
  const descartesOptions =
    DescartesOptionsWeakMap.get(variations) ??
    (() => {
      const res = computed(() => getDescartesOptions(variations.value));
      DescartesOptionsWeakMap.set(variations, res);
      return res;
    })();
  return {
    descartesOptions,
    add: (addItems: Variation | Variation[]) => {
      addVariationOption(variationSkus.value, {
        variations: variations.value,
        descartesOptions: descartesOptions.value,
        updateItem,
        createItem,
        addItems: wrapInArray(addItems),
      });
      if (needSort) sortVariationOption(variationSkus.value, variations.value);
    },
    remove: () => {
      removeVariationOption<T>(variationSkus.value, {
        variations: variations.value,
        descartesOptions: descartesOptions.value,
        updateItem,
      });
      if (needSort) sortVariationOption(variationSkus.value, variations.value);
    },
  };
}
