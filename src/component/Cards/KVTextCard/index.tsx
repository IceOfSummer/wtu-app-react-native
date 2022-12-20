import React from 'react'
import Cards, { CardProps } from '../index'
import { StyleSheet, Text, View } from 'react-native'
import Icons from '../../Icons'

interface KVTextCardProps extends CardProps {
  title: Displayable
  value?: Displayable
  showArrow?: boolean
}

const KVTextCard: React.FC<KVTextCardProps> = props => {
  return (
    <Cards {...props}>
      <View style={styles.container}>
        <Text style={styles.title}>{props.title}</Text>
        <View style={global.styles.flexRow}>
          <Text style={styles.value}>{props.value}</Text>
          {props.showArrow ? <Icons iconText="&#xe61c;" size={20} /> : null}
        </View>
      </View>
    </Cards>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  value: {
    fontSize: global.styles.$font_size_base,
  },
})

export default KVTextCard
