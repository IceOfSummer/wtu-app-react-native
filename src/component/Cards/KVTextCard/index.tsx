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
        <View style={styles.textContainer}>
          <Text style={styles.value}>{props.value}</Text>
        </View>
        {props.showArrow ? <Icons iconText="&#xe61c;" size={20} /> : null}
      </View>
    </Cards>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
    marginRight: 4,
  },
  value: {
    fontSize: global.styles.$font_size_base,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})

export default KVTextCard
