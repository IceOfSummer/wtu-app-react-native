/**
 * 单向队列
 */
export interface OneWayQueue<T> {
  pop: () => T | undefined
  push: (data: T) => void
  peek: () => T | undefined
  empty: () => boolean
}

/**
 * 单个链表节点
 */
class Node<T> {
  public front: Node<T> | undefined
  public value: T

  constructor(front: Node<T> | undefined, value: T) {
    this.front = front
    this.value = value
  }
}

/**
 * 使用链表构建的单向队列
 */
export default class LinkedOneWayQueue<T> implements OneWayQueue<T> {
  private tail: Node<T> | undefined

  peek(): T | undefined {
    return this.tail?.value
  }

  pop(): T | undefined {
    const prevTail = this.tail
    if (prevTail) {
      this.tail = prevTail.front
      return prevTail.value
    }
    return undefined
  }

  push(data: T): void {
    this.tail = new Node(this.tail, data)
  }

  empty(): boolean {
    return this.tail === undefined
  }
}
