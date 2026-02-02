export function deepClone(obj: Object) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  return JSON.parse(JSON.stringify(obj))
}