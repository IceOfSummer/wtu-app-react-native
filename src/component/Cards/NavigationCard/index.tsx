import React from 'react'
import { RouterTypes } from '../../../router'
import SimpleCard from '../SimpleCard'
import Icons from '../../Icons'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import { GestureResponderEvent } from 'react-native'

interface NavigationCardProps {
  to?: keyof RouterTypes
  onTap?: (event: GestureResponderEvent) => void
  title: string
  hideBorder?: boolean
}

const NavigationCard: React.FC<NavigationCardProps> = props => {
  const nav = useNavigation<NavigationProp<RouterTypes>>()

  const tapEvent = (e: GestureResponderEvent) => {
    props.onTap?.(e)
    if (props.to) {
      nav.navigate(props.to)
    }
  }

  return (
    <SimpleCard
      title={props.title}
      hideBorder={props.hideBorder}
      right={<Icons iconText="&#xe61c;" size={20} />}
      onTap={tapEvent}
    />
  )
}

export default NavigationCard
