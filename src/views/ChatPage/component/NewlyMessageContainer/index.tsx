import React, { useState } from 'react'
import MessageContainer, { MessageContainerProps } from '../MessageContainer'
import { LayoutChangeEvent, View } from 'react-native'

interface NewlyMessageContainer extends MessageContainerProps {
  /**
   * 当测量完毕时
   */
  onMeasureDone: (height: number, show: () => void) => void
}

/**
 * 新增消息的容器
 *
 * 先把容器隐藏，等渲染出来得到高度后再进行其它操作
 */
const NewlyMessageContainer: React.FC<NewlyMessageContainer> = props => {
  const [show, setShow] = useState(false)

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    props.onMeasureDone(nativeEvent.layout.height, () => setShow(true))
  }
  return (
    <View
      style={{
        position: show ? 'relative' : 'absolute',
        opacity: show ? 1 : 0,
      }}>
      <MessageContainer {...props} onLayout={onLayout} />
    </View>
  )
}

export default NewlyMessageContainer
