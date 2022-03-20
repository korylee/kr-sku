import { calcDescartes } from "./utils"
export const mapSkip = Symbol('skip')

export function map(iterable, mapper) {
  const result = []
  for (let i = 0; i < iterable.length; i++) {
    const item = iterable[i]
    const element = mapper(item, i, iterable)
    if (element === mapSkip) continue
    result.push(element)
  }
  return result
}

export type Uid = string

export function getDescartesUidArray(
  variations
): Uid[][] {
  const optionsArray = map(variations, ({ options }) =>
    options?.length ? options.map(({ uid }) => uid) : mapSkip
  )
  return calcDescartes(optionsArray)
}
