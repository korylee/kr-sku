import { computed } from "vue-demi";
function wrapInArray(v) {
  return v != null && v !== void 0 ? Array.isArray(v) ? v : [v] : [];
}
function calcDescartes(array) {
  if (!(array == null ? void 0 : array.length))
    return [];
  if (array.length === 1)
    return array[0].map((item) => [item]);
  return array.reduce((total, currentValue) => {
    const res = [];
    total.forEach((t) => {
      currentValue.forEach((cv) => {
        res.push([...wrapInArray(t), cv]);
      });
    });
    return res;
  });
}
function isSimilarArray(a, b) {
  return !a.some((item) => !b.includes(item));
}
const noop = () => {
};
function getDescartesOptions(variations) {
  const optionsArray = variations.filter(({ options }) => options == null ? void 0 : options.length).map(({ options }) => options);
  return calcDescartes(optionsArray);
}
const getUids = (options) => options.map((option) => option.uid);
function removeVariationOption(items, {
  variations,
  descartesUidArray,
  updateItem = noop
}) {
  const removeIndex = [];
  const memo = [];
  descartesUidArray = descartesUidArray != null ? descartesUidArray : getDescartesOptions(variations);
  items.forEach((variationTableItem, index) => {
    let res = true;
    descartesUidArray.forEach((options, index2) => {
      const result = isSimilarArray(getUids(options), getUids(variationTableItem.options));
      if (result) {
        if (!memo[index2])
          res = false;
        variationTableItem.options = options;
        updateItem == null ? void 0 : updateItem(variationTableItem, options, variations);
        memo[index2] = true;
      }
    });
    if (res)
      removeIndex.push(index);
  });
  const len = removeIndex.length;
  for (let i = len - 1; i >= 0; i--) {
    const item = removeIndex[i];
    items.splice(item, 1);
  }
}
function addVariationOption(items, {
  variations,
  descartesUidArray,
  createItem = (options) => ({ options }),
  updateItem = noop,
  addItems = []
}) {
  descartesUidArray = descartesUidArray != null ? descartesUidArray : getDescartesOptions(variations);
  descartesUidArray.forEach((options) => {
    const findIndex = items.findIndex((variationTableItem) => {
      const res = isSimilarArray(getUids(variationTableItem.options), getUids(options));
      if (res) {
        variationTableItem.options = options;
        updateItem == null ? void 0 : updateItem(variationTableItem, options, variations);
      }
      return res;
    });
    if (findIndex !== -1)
      return;
    const isContain = (addItems == null ? void 0 : addItems.length) ? options.some(({ uid }) => addItems.some((item) => uid === item.uid)) : true;
    if (!isContain)
      return;
    const addItem = createItem(options, variations);
    items.push(addItem);
  });
}
function uidsToIndex(uids, variations) {
  return uids.map((uid, index) => variations[index].options.findIndex((option) => option.uid === uid));
}
function sortVariationOption(items, variations) {
  items.sort((a, b) => parseInt(uidsToIndex(getUids(a.options), variations).join("")) - parseInt(uidsToIndex(getUids(b.options), variations).join("")));
}
function useVariationOption(variations, variationSkus, createItem, updateItem, needSort = true) {
  const descartesUidArray = computed(() => getDescartesOptions(variations.value));
  return {
    descartesUidArray,
    add: (addItems) => {
      addVariationOption(variationSkus.value, {
        variations: variations.value,
        descartesUidArray: descartesUidArray.value,
        updateItem,
        createItem,
        addItems: wrapInArray(addItems)
      });
      if (needSort)
        sortVariationOption(variationSkus.value, variations.value);
    },
    remove: () => {
      removeVariationOption(variationSkus.value, {
        variations: variations.value,
        descartesUidArray: descartesUidArray.value,
        updateItem
      });
      if (needSort)
        sortVariationOption(variationSkus.value, variations.value);
    }
  };
}
export { addVariationOption, getDescartesOptions, removeVariationOption, sortVariationOption, uidsToIndex, useVariationOption };
