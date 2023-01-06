import React from 'react'
import Button from 'react-native-button'
import { StyleSheet, Text, View } from 'react-native'

interface ControlButtonProps {
  onPress?: () => void
  title: string
  color?: string
}

const ControlButton: React.FC<ControlButtonProps> = props => {
  return (
    <Button
      onPress={props.onPress}
      containerStyle={[styles.buttonContainer, { borderColor: props.color }]}>
      <View style={styles.innerContainer}>
        <Text style={[styles.text, { color: props.color }]}>{props.title}</Text>
      </View>
    </Button>
  )
}
ControlButton.defaultProps = { color: global.colors.textColor }

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 15,
    marginHorizontal: 4,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  innerContainer: {
    padding: 5,
  },
  text: {
    fontSize: global.styles.$font_size_sm,
  },
})

export default ControlButton
