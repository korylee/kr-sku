export function wrapInArray<T>(v: T | T[] | null | undefined): T[] {
  if ([undefined,null].includes(v)) return []
  return Array.isArray(v) ? v : [v]
}


export function calcDescartes(array) {
  if (!array?.length) return []
  if (array.length === 1) return array[0].map((item) => [item])

  return array.reduce((total, currentValue) => {
    let res = []

    total.forEach((t) => {
      currentValue.forEach((cv) => {
        res.push([...wrapInArray(t), cv])
      })
    })
    return res
  })
}