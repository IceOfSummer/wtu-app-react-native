import React from 'react'
import { StyleSheet, View } from 'react-native'
import styles from './styles'

export interface CardProps {
  hideBorder?: boolean
  onTouchEndCapture?: () => void
  onTouchEnd?: () => void
}

/**
 * 一个基础的Card组件, 可用于拓展
 */
const Cards: React.FC<CardProps> = props => {
  return (
    <View style={styles.cardOuter}>
      <View
        onTouchEndCapture={props.onTouchEndCapture}
        onTouchEnd={props.onTouchEnd}
        style={{
          ...styles.cardContainer,
          borderBottomWidth: props.hideBorder ? 0 : StyleSheet.hairlineWidth,
        }}>
        {props.children}
      </View>
    </View>
  )
}

export default Cards
