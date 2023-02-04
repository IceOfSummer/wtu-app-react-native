import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

interface ColorItemProps {
  color: string
  onPress?: (color: string) => void
}

const ColorItem: React.FC<ColorItemProps> = props => {
  return (
    <Pressable
      style={[styles.container, { backgroundColor: props.color }]}
      onPress={() => props.onPress?.(props.color)}
    />
  )
}

const LENGTH = 30

const styles = StyleSheet.create({
  container: {
    width: LENGTH,
    height: LENGTH,
    borderRadius: LENGTH,
  },
})

export default ColorItem
