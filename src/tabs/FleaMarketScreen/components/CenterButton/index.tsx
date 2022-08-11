import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Link } from '@react-navigation/native'

interface CenterButton {
  image: any
  name: string
  to: string
}

/**
 * 界面中间的button组件
 */
const CenterButton: React.FC<CenterButton> = props => {
  return (
    <Link to={props.to}>
      <View style={styles.container}>
        <View>
          <Image source={props.image} style={styles.image} />
        </View>
        <Text style={styles.text}>{props.name}</Text>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  text: {
    fontSize: 12,
    color: global.styles.$text_color,
  },
  image: {
    maxWidth: 50,
    maxHeight: 50,
    borderWidth: 1,
  },
})

export default CenterButton
