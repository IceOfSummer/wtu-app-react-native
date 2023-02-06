import { Stack } from './index'

/**
 * 单个链表节点
 */
class Node<T> {
  public bottom: Node<T> | undefined
  public value: T

  constructor(front: Node<T> | undefined, value: T) {
    this.bottom = front
    this.value = value
  }
}

/**
 * 使用链表来组成栈，能够有效避免溢出
 */
export default class LinkedStack<T> implements Stack<T> {
  private top: Node<T> | undefined

  private currentSize = 0

  isEmpty(): boolean {
    return this.top === undefined
  }

  peek(): T | undefined {
    return this.top?.value
  }

  pop(): T | undefined {
    const prevTail = this.top
    if (prevTail) {
      this.currentSize--
      this.top = prevTail.bottom
      return prevTail.value
    }
    return undefined
  }

  push(data: T): void {
    this.currentSize++
    this.top = new Node(this.top, data)
  }

  pushAll(data: T[]): void {
    this.currentSize += data.length
    data.forEach(value => {
      this.push(value)
    })
  }

  size(): number {
    return this.currentSize
  }
}
