import { wrapInArray } from "@korylee/utils";
export function calcDescartes(array) {
    if (!(array === null || array === void 0 ? void 0 : array.length))
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
export function isSimilarArray(a, b) {
    return !a.some((item) => !b.includes(item));
}
export const noop = () => { };
