import { calcDescartes, isSimilarArray, noop } from "./utils";
import { map, mapSkip, wrapInArray } from "@korylee/utils";
import type { Ref } from "vue";
import { computed } from "vue-demi";
type Uid = string;
interface Variation {
  uid: Uid;
  name: string;
  options: {
    uid: Uid;
    value: string;
  }[];
}

export function getDescartesUidArray(variations: Variation[]): Uid[][] {
  const optionsArray = map(variations, ({ options }) =>
    options?.length ? options.map(({ uid }) => uid) : mapSkip
  );
  return calcDescartes(optionsArray);
}

type UpdateItemFn<T> = (item: T, uids: Uid[], variations: Variation[]) => void;

interface VariationSku {
  uids: Uid[];
}

export function removeVariationOption<T extends VariationSku>(
  items: T[],
  {
    variations,
    descartesUidArray,
    updateItem = noop,
  }: {
    variations: Variation[];
    descartesUidArray?: Uid[][];
    needSort?: boolean;
    updateItem?: UpdateItemFn<T>;
  }
): void {
  const removeIndex: number[] = [];
  const memo: boolean[] = [];
  descartesUidArray = descartesUidArray ?? getDescartesUidArray(variations);
  items.forEach((variationTableItem, index) => {
    let res = true;
    (descartesUidArray as Uid[][]).forEach((uids, index) => {
      const result = isSimilarArray(uids, variationTableItem.uids);
      if (result) {
        if (!memo[index]) res = false;
        variationTableItem.uids = uids;
        updateItem?.(variationTableItem, uids, variations);
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
    descartesUidArray,
    createItem = (uids) => ({ uids } as T),
    updateItem = noop,
    addItems = [],
  }: {
    variations: Variation[];
    descartesUidArray?: Uid[][];
    createItem?: (uids: Uid[], variations: Variation[]) => T;
    updateItem?: UpdateItemFn<T>;
    addItems?: Variation[];
  }
): void {
  descartesUidArray = descartesUidArray ?? getDescartesUidArray(variations);
  descartesUidArray.forEach((uids) => {
    const findIndex = items.findIndex((variationTableItem) => {
      const res = isSimilarArray(variationTableItem.uids, uids);
      if (res) {
        variationTableItem.uids = uids;
        updateItem?.(variationTableItem, uids, variations);
      }
      return res;
    });
    if (findIndex !== -1) return;
    const isContain = addItems?.length
      ? uids.some((uid) => addItems.some((item) => uid === item.uid))
      : true;
    if (!isContain) return;
    const addItem = createItem(uids, variations);
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
      parseInt(uidsToIndex(a.uids, variations).join("")) -
      parseInt(uidsToIndex(b.uids, variations).join(""))
  );
}

export function useVariationOption<T extends VariationSku>(
  variations: Ref<Variation[]>,
  VariationSkus: Ref<T[]>,
  createItem?: (uids: Uid[], variations: Variation[]) => T,
  updateItem?: UpdateItemFn<T>,
  needSort: boolean = true
) {
  const descartesUidArray = computed(() => getDescartesUidArray(variations.value));
  return {
    descartesUidArray,
    add: (addItems: Variation | Variation[]) => {
      addVariationOption(VariationSkus.value, {
        variations: variations.value,
        descartesUidArray: descartesUidArray.value,
        updateItem,
        createItem,
        addItems: wrapInArray(addItems),
      });
      if (needSort) sortVariationOption(VariationSkus.value, variations.value);
    },
    remove: () => {
      removeVariationOption<T>(VariationSkus.value, {
        variations: variations.value,
        descartesUidArray: descartesUidArray.value,
        updateItem,
      });
      if (needSort) sortVariationOption(VariationSkus.value, variations.value);
    },
  };
}
