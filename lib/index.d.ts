import type { Ref } from "vue-demi";
declare type Uid = string;
interface Variation {
    uid: Uid;
    name: string;
    options: {
        uid: Uid;
        value: string;
    }[];
}
export declare function getDescartesUidArray(variations: Variation[]): Uid[][];
declare type UpdateItemFn<T> = (item: T, uids: Uid[], variations: Variation[]) => void;
interface VariationSku {
    uids: Uid[];
}
export declare function removeVariationOption<T extends VariationSku>(items: T[], { variations, descartesUidArray, updateItem, }: {
    variations: Variation[];
    descartesUidArray?: Uid[][];
    needSort?: boolean;
    updateItem?: UpdateItemFn<T>;
}): void;
export declare function addVariationOption<T extends VariationSku>(items: T[], { variations, descartesUidArray, createItem, updateItem, addItems, }: {
    variations: Variation[];
    descartesUidArray?: Uid[][];
    createItem?: (uids: Uid[], variations: Variation[]) => T;
    updateItem?: UpdateItemFn<T>;
    addItems?: Variation[];
}): void;
export declare function uidsToIndex(uids: Uid[], variations: Variation[]): number[];
export declare function sortVariationOption(items: VariationSku[], variations: Variation[]): void;
export declare function useVariationOption<T extends VariationSku>(variations: Ref<Variation[]>, variationSkus: Ref<T[]>, createItem?: (uids: Uid[], variations: Variation[]) => T, updateItem?: UpdateItemFn<T>, needSort?: boolean): {
    descartesUidArray: import("vue-demi").ComputedRef<string[][]>;
    add: (addItems: Variation | Variation[]) => void;
    remove: () => void;
};
export {};
