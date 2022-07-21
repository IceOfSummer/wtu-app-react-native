import BottomMenu, { MenuItem } from '../../Menu/BottomMenu'
import PubSub from 'pubsub-js'
import React from 'react'
import { OpenDrawerParam, PUBSUB_KEY } from '../../index'

type BottomMenuStaticType = {
  open: (
    items: Array<MenuItem>,
    onSelect?: (index: number, item: MenuItem) => void,
    title?: string
  ) => void
  close: () => void
}

/**
 * 显示底部菜单
 */
export const BottomMenuStatic: BottomMenuStaticType = {
  open: (items, onSelect, title) => {
    const data: OpenDrawerParam = {
      node: (
        <BottomMenu
          title={title}
          items={items}
          onSelect={(index, item) => {
            PubSub.publish(PUBSUB_KEY, {
              order: 1,
            })
            if (item) {
              onSelect?.(index, item)
            }
          }}
        />
      ),
      height: 200,
    }
    PubSub.publish(PUBSUB_KEY, {
      order: 0,
      param: data,
    })
  },
  close: () => {
    PubSub.publish(PUBSUB_KEY, {
      order: 1,
    })
  },
}
