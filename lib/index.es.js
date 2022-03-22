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
function getDescartesUidArray(variations) {
  const optionsArray = variations.filter(({ options }) => !(options == null ? void 0 : options.length)).map(({ options }) => options.map(({ uid }) => uid));
  return calcDescartes(optionsArray);
}
function removeVariationOption(items, {
  variations,
  descartesUidArray,
  updateItem = noop
}) {
  const removeIndex = [];
  const memo = [];
  descartesUidArray = descartesUidArray != null ? descartesUidArray : getDescartesUidArray(variations);
  items.forEach((variationTableItem, index) => {
    let res = true;
    descartesUidArray.forEach((uids, index2) => {
      const result = isSimilarArray(uids, variationTableItem.uids);
      if (result) {
        if (!memo[index2])
          res = false;
        variationTableItem.uids = uids;
        updateItem == null ? void 0 : updateItem(variationTableItem, uids, variations);
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
  createItem = (uids) => ({ uids }),
  updateItem = noop,
  addItems = []
}) {
  descartesUidArray = descartesUidArray != null ? descartesUidArray : getDescartesUidArray(variations);
  descartesUidArray.forEach((uids) => {
    const findIndex = items.findIndex((variationTableItem) => {
      const res = isSimilarArray(variationTableItem.uids, uids);
      if (res) {
        variationTableItem.uids = uids;
        updateItem == null ? void 0 : updateItem(variationTableItem, uids, variations);
      }
      return res;
    });
    if (findIndex !== -1)
      return;
    const isContain = (addItems == null ? void 0 : addItems.length) ? uids.some((uid) => addItems.some((item) => uid === item.uid)) : true;
    if (!isContain)
      return;
    const addItem = createItem(uids, variations);
    items.push(addItem);
  });
}
function uidsToIndex(uids, variations) {
  return uids.map((uid, index) => variations[index].options.findIndex((option) => option.uid === uid));
}
function sortVariationOption(items, variations) {
  items.sort((a, b) => parseInt(uidsToIndex(a.uids, variations).join("")) - parseInt(uidsToIndex(b.uids, variations).join("")));
}
function useVariationOption(variations, variationSkus, createItem, updateItem, needSort = true) {
  const descartesUidArray = computed(() => getDescartesUidArray(variations.value));
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
export { addVariationOption, getDescartesUidArray, removeVariationOption, sortVariationOption, uidsToIndex, useVariationOption };
