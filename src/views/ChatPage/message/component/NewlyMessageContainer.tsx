import React, { useEffect } from 'react'
import MessageContainer, { MessageContainerProps } from './MessageContainer'

interface NewlyMessageContainer extends MessageContainerProps {
  /**
   * 当测量完毕时
   */
  onMeasureDone: () => void
}

/**
 * 新增消息的容器
 *
 */
const NewlyMessageContainer: React.FC<NewlyMessageContainer> = props => {
  useEffect(() => {
    props.onMeasureDone()
  }, [])

  return <MessageContainer {...props} />
}

export default NewlyMessageContainer
