import React, { useState } from 'react'
import { GestureResponderEvent, StyleSheet, View } from 'react-native'
import styles from './styles'
import TappableView from '../TappableView'

export interface CardProps {
  hideBorder?: boolean
  onTap?: (event: GestureResponderEvent) => void
}

/**
 * 一个基础的Card组件, 可用于拓展
 */
const Cards: React.FC<CardProps> = props => {
  const [isTouch, setTouch] = useState(false)
  return (
    <TappableView
      onTouchStart={() => setTouch(true)}
      onTouchEnd={() => setTouch(false)}
      style={[
        styles.cardOuter,
        {
          backgroundColor: isTouch ? global.styles.$bg_color_hover : '#fff',
        },
      ]}
      onTap={props.onTap}>
      <View
        style={{
          ...styles.cardContainer,
          borderBottomWidth: props.hideBorder ? 0 : StyleSheet.hairlineWidth,
        }}>
        {props.children}
      </View>
    </TappableView>
  )
}

export default Cards
