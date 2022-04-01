import React from 'react'
import styles from './styles'
import { View, Text } from 'react-native'
import Cards, { CardProps } from '../index'

interface SimpleCardProps extends CardProps {
  right?: React.ReactNode
  title: string
  rightContent?: string
  type?: 'default' | 'error' | 'primary'
}

/**
 * 简单卡片, 用于展示一些基础信息
 */
const SimpleCard: React.FC<SimpleCardProps> = props => {
  const textColor = getTextColor()
  /**
   * 根据props的type属性获取对应color
   */
  function getTextColor(): string {
    switch (props.type) {
      case 'default':
        return global.styles.$text_color
      case 'error':
        return global.styles.$error_color
      case 'primary':
        return global.styles.$primary_color
      default:
        return global.styles.$text_color
    }
  }
  return (
    <Cards {...props}>
      <View style={{ flexGrow: 1 }}>
        {props.children}
        <Text style={{ ...styles.text, color: textColor }}>{props.title}</Text>
      </View>
      <View style={{ flexGrow: 1, alignItems: 'flex-end' }}>
        {props.right ? (
          props.right
        ) : (
          <Text style={[styles.text, { textAlign: 'right' }]}>
            {props.rightContent}
          </Text>
        )}
      </View>
    </Cards>
  )
}

export default SimpleCard
