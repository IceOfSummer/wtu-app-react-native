import React from 'react'
import { Text } from 'react-native'
import Cards, { CardProps } from '../index'

interface CenterTextCardProps extends CardProps {
  title: string
  type?: 'primary' | 'error'
}

/**
 * 将字体居中的卡牌, 一般用于交互
 */
const CenterTextCard: React.FC<CenterTextCardProps> = props => {
  const textColor = getTextColor()
  /**
   * 根据props的type属性获取对应color
   */
  function getTextColor(): string {
    switch (props.type) {
      case 'primary':
        return global.styles.$primary_color
      case 'error':
        return global.styles.$error_color
      default:
        return global.styles.$primary_color
    }
  }
  return (
    <Cards {...props}>
      <Text style={{ color: textColor, flexGrow: 1, textAlign: 'center' }}>
        {props.title}
      </Text>
    </Cards>
  )
}

export default CenterTextCard
