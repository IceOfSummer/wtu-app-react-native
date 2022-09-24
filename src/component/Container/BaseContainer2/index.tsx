import React from 'react'
import BaseContainer, { BaseContainerProps } from '../BaseContainer'
import { View } from 'react-native'

/**
 * 改进的基础容器，在显示title时会有更好的表现
 */
const BaseContainer2: React.FC<BaseContainerProps> = props => {
  return (
    <BaseContainer {...props}>
      <View style={{ marginTop: 6, marginLeft: 4 }}>{props.children}</View>
    </BaseContainer>
  )
}

export default BaseContainer2
