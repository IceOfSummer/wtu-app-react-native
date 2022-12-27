import React from 'react'
import { View, ViewStyle } from 'react-native'

interface ConditionHideContainer {
  hide?: boolean
  style?: ViewStyle
}

const ConditionHideContainer: React.FC<ConditionHideContainer> = props => {
  if (props.hide) {
    return null
  } else {
    return <View style={props.style}>{props.children}</View>
  }
}

export default ConditionHideContainer
