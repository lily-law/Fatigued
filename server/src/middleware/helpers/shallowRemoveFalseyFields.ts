export default function shallowRemoveFalseyFields(obj: { [key: string]: any }) {
  const output = { ...obj }
  Object.entries(obj).forEach(([key, val]) => {
    if (!val) {
      delete output[key]
    }
  })
  return output
}
