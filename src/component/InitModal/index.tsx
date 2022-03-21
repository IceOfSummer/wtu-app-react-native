import React from 'react'
import { ColorValue, View, Text } from 'react-native'
import LoadingAnimation from '../Loading/LoadingAnimation'

interface InitModalProps {
  visible: boolean
  backgroundColor?: ColorValue
  showLoadingAnimation?: boolean
}

/**
 * 快速创建一个蒙层盖住所有内容, 在初始化完毕后显示内容
 * 需要将其放置在层级较高的地方以覆盖所有内容
 * 可以配合 {@link requestAnimationFrame} 使用
 */
const InitModal: React.FC<InitModalProps> = props => {
  return props.visible ? (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {props.showLoadingAnimation ? (
        <View>
          <LoadingAnimation />
          <Text
            style={{
              textAlign: 'center',
              color: global.styles.$primary_color,
            }}>
            加载中
          </Text>
        </View>
      ) : null}
    </View>
  ) : null
}
export default InitModal
