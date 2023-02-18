import React from 'react'
import { View, ViewStyle } from 'react-native'
import { getLogger } from '../../../utils/LoggerUtils'

const logger = getLogger('/component/Container/ConditionHideContainer')

interface ConditionHideContainer {
  hide?: boolean
  style?: ViewStyle | ViewStyle[]
}
type IfProps = {
  visible: boolean
  style?: ViewStyle | ViewStyle[]
}

export const If: React.FC<IfProps> = props => {
  return <View style={props.style}>{props.children}</View>
}

type ElseProps = {
  style?: ViewStyle | ViewStyle[]
}

export const Else: React.FC<ElseProps> = props => {
  return <View style={props.style}>{props.children}</View>
}

/**
 * 支持使用If，Else组件来进行切换
 * @param props
 * @constructor
 */
const ConditionHideContainer: React.FC<ConditionHideContainer> = props => {
  let currentShow = props.hide ? 0 : 1
  if (props.children) {
    if (Array.isArray(props.children) && props.children.length === 2) {
      const instance = props.children[0]
      if (instance.type === If && instance.props.visible) {
        currentShow = 2
      } else {
        // if (props.children[1].type !== Else) {
        //   logger.warn(
        //     'the Component after <If>...</If> must be <Else>...</Else>, current: ' +
        //       props.children[1]
        //   )
        // }
        currentShow = 3
      }
    }
  }

  if (currentShow === 0) {
    return null
  } else if (currentShow === 1) {
    return <View style={props.style}>{props.children}</View>
  } else if (currentShow === 2) {
    // @ts-ignore
    return props.children[0]
  } else if (currentShow === 3) {
    // @ts-ignore
    return props.children[1]
  } else {
    logger.warn('unexpected state, currentShow = ' + currentShow)
    return null
  }
}

export default ConditionHideContainer
