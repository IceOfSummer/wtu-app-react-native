import React from 'react'
import { ColorValue, StyleSheet, Text, View } from 'react-native'

export interface TagProps {
  name: string
  color?: ColorValue
  textColor?: ColorValue
}

const Tag: React.FC<TagProps> = props => {
  return (
    <View style={[{ backgroundColor: props.color }, styles.container]}>
      <Text style={{ color: props.textColor }}>{props.name}</Text>
    </View>
  )
}

Tag.defaultProps = { color: global.colors.primaryColor, textColor: '#fff' }

const styles = StyleSheet.create({
  container: {
    padding: 4,
    borderRadius: 8,
  },
})

export default Tag
