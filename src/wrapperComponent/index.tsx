import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import BottomDrawer, { BottomDrawerRefAttribute } from './BottomDrawer'

export const PUBSUB_KEY = 'CallStaticComponent'

type PubSubData = {
  order: number
  param?: unknown
}

export type OpenDrawerParam = { node: ReactNode; height: number }

const WrapperComponent: React.FC = props => {
  const [openDrawerParam, setOpenDrawerParam] = useState<OpenDrawerParam>()
  const bottomDrawer = useRef<BottomDrawerRefAttribute>(null)
  const staticCallList: Array<Function> = []

  staticCallList[0] = (param: OpenDrawerParam) => {
    setOpenDrawerParam(param)
    bottomDrawer.current?.openDrawer()
  }

  staticCallList[1] = () => {
    bottomDrawer.current?.closeDrawer()
  }

  useEffect(() => {
    PubSub.subscribe(PUBSUB_KEY, (msg, data) => {
      if (typeof data !== 'object' && !data.order) {
        return
      }
      const _data = data as PubSubData
      staticCallList[_data.order]?.(_data.param)
    })
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {props.children}
      {/* experiment! may have performance issues */}
      <BottomDrawer param={openDrawerParam} ref={bottomDrawer} />
    </View>
  )
}

export default WrapperComponent
