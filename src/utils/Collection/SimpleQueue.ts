import { Queue } from './index'

/**
 * 单个链表节点
 */
class Node<T> {
  public next: Node<T> | undefined
  public last: Node<T> | undefined
  public value: T

  constructor(value: T) {
    this.value = value
  }
}

/**
 * 队列的简单实现
 */
export default class SimpleQueue<T> implements Queue<T> {
  private head: Node<T> | undefined

  private tail: Node<T> | undefined

  isEmpty(): boolean {
    return this.head === undefined
  }

  peek(): T | undefined {
    return this.head?.value
  }

  pop(): T | undefined {
    const temp = this.head
    if (temp) {
      this.head = temp.next
      return temp.value
    }
    if (this.head === undefined) {
      this.tail = undefined
    }
    return undefined
  }

  push(data: T): void {
    if (this.tail === undefined) {
      this.head = this.tail = new Node<T>(data)
    } else {
      this.tail.next = new Node<T>(data)
      this.tail = this.tail.next
    }
  }
}
