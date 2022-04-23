/**
 * 深拷贝对象
 * @param src 目标对象
 */
export const deepCopyObject = <T>(src: T): T => {
  return JSON.parse(JSON.stringify(src))
}
