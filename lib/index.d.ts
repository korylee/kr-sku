import type { Ref, ComputedRef } from "vue-demi";
export declare type Uid = string | number;
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
export declare function getDescartesOptions(variations: Variation[]): VariationOption[][];
declare type UpdateItemFn<T> = (item: T, options: VariationOption[], variations: Variation[]) => void;
export interface VariationSku {
    [p: string]: any;
    options: VariationOption[];
}
export declare function removeVariationOption<T extends VariationSku>(items: T[], { variations, descartesOptions, updateItem, }: {
    variations: Variation[];
    descartesOptions?: VariationOption[][];
    needSort?: boolean;
    updateItem?: UpdateItemFn<T>;
}): void;
export declare function addVariationOption<T extends VariationSku>(items: T[], { variations, descartesOptions, createItem, updateItem, addItems, }: {
    variations: Variation[];
    descartesOptions?: VariationOption[][];
    createItem?: (options: VariationOption[], variations: Variation[]) => T;
    updateItem?: UpdateItemFn<T>;
    addItems?: Variation[];
}): void;
export declare function uidsToIndex(uids: Uid[], variations: Variation[]): number[];
export declare function sortVariationOption(items: VariationSku[], variations: Variation[]): void;
export declare function useVariationOption<T extends VariationSku>(variations: Ref<Variation[]>, variationSkus: Ref<T[]>, createItem?: (options: VariationOption[], variations: Variation[]) => T, updateItem?: UpdateItemFn<T>, needSort?: boolean): {
    descartesOptions: ComputedRef<VariationOption[][]>;
    add: (addItems: Variation | Variation[]) => void;
    remove: () => void;
};
export {};
