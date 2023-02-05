/**
 * 队列. 先进先出
 */
export interface Queue<T> {
  pop: () => T | undefined
  push: (data: T) => void
  peek: () => T | undefined
  isEmpty: () => boolean
}

/**
 * 队列. 先进先出
 */
export interface Stack<T> {
  pop: () => T | undefined
  push: (data: T) => void
  peek: () => T | undefined
  isEmpty: () => boolean
}
