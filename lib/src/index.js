import { calcDescartes, isSimilarArray, noop } from "./utils";
import { map, mapSkip, wrapInArray } from "@korylee/utils";
import { computed } from "vue-demi";
export function getDescartesUidArray(variations) {
    const optionsArray = map(variations, ({ options }) => (options === null || options === void 0 ? void 0 : options.length) ? options.map(({ uid }) => uid) : mapSkip);
    return calcDescartes(optionsArray);
}
export function removeVariationOption(items, { variations, descartesUidArray, updateItem = noop, }) {
    const removeIndex = [];
    const memo = [];
    descartesUidArray = descartesUidArray !== null && descartesUidArray !== void 0 ? descartesUidArray : getDescartesUidArray(variations);
    items.forEach((variationTableItem, index) => {
        let res = true;
        descartesUidArray.forEach((uids, index) => {
            const result = isSimilarArray(uids, variationTableItem.uids);
            if (result) {
                if (!memo[index])
                    res = false;
                variationTableItem.uids = uids;
                updateItem === null || updateItem === void 0 ? void 0 : updateItem(variationTableItem, uids, variations);
                memo[index] = true;
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
export function addVariationOption(items, { variations, descartesUidArray, createItem = (uids) => ({ uids }), updateItem = noop, addItems = [], }) {
    descartesUidArray = descartesUidArray !== null && descartesUidArray !== void 0 ? descartesUidArray : getDescartesUidArray(variations);
    descartesUidArray.forEach((uids) => {
        const findIndex = items.findIndex((variationTableItem) => {
            const res = isSimilarArray(variationTableItem.uids, uids);
            if (res) {
                variationTableItem.uids = uids;
                updateItem === null || updateItem === void 0 ? void 0 : updateItem(variationTableItem, uids, variations);
            }
            return res;
        });
        if (findIndex !== -1)
            return;
        const isContain = (addItems === null || addItems === void 0 ? void 0 : addItems.length)
            ? uids.some((uid) => addItems.some((item) => uid === item.uid))
            : true;
        if (!isContain)
            return;
        const addItem = createItem(uids, variations);
        items.push(addItem);
    });
}
export function uidsToIndex(uids, variations) {
    return uids.map((uid, index) => variations[index].options.findIndex((option) => option.uid === uid));
}
export function sortVariationOption(items, variations) {
    items.sort((a, b) => parseInt(uidsToIndex(a.uids, variations).join("")) -
        parseInt(uidsToIndex(b.uids, variations).join("")));
}
export function useVariationOption(variations, VariationSkus, createItem, updateItem, needSort = true) {
    const descartesUidArray = computed(() => getDescartesUidArray(variations.value));
    return {
        descartesUidArray,
        add: (addItems) => {
            addVariationOption(VariationSkus.value, {
                variations: variations.value,
                descartesUidArray: descartesUidArray.value,
                updateItem,
                createItem,
                addItems: wrapInArray(addItems),
            });
            if (needSort)
                sortVariationOption(VariationSkus.value, variations.value);
        },
        remove: () => {
            removeVariationOption(VariationSkus.value, {
                variations: variations.value,
                descartesUidArray: descartesUidArray.value,
                updateItem,
            });
            if (needSort)
                sortVariationOption(VariationSkus.value, variations.value);
        },
    };
}
