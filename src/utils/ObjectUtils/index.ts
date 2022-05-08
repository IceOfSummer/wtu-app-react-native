/**
 * 深拷贝对象
 * @param src 目标对象
 */
export const deepCopyObject = <T>(src: T): T => {
  return JSON.parse(JSON.stringify(src))
}

/**
 * 检查该值是否为null, 若为null则抛出异常
 */
export const nonNull = <T>(val: T | undefined): NonNullable<T> => {
  if (val) {
    return val!
  } else {
    throw new Error()
  }
}
