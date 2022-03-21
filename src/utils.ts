import { wrapInArray } from "@korylee/utils";

export function calcDescartes(array: any[]): any {
  if (!array?.length) return [];
  if (array.length === 1) return array[0].map((item: any) => [item]);

  return array.reduce((total, currentValue) => {
    const res: any[] = [];

    total.forEach((t:any) => {
      currentValue.forEach((cv:any) => {
        res.push([...wrapInArray(t), cv]);
      });
    });
    return res;
  });
}

export function isSimilarArray(a: any[], b: any[]): boolean {
  return !a.some((item) => !b.includes(item));
}

export const noop = () => {};
