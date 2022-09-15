import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import PrimaryButton from '../../Button/PrimaryButton'

interface RetryViewProps {
  onRetry?: () => void
  show?: boolean
}

const RetryView: React.FC<RetryViewProps> = props => {
  return (
    <View style={[style.container, { opacity: props.show ? 1 : 0 }]}>
      <Image source={require('../image/cry.png')} style={style.image} />
      <Text style={global.styles.errorTipText}>请求失败了</Text>
      <PrimaryButton
        onPress={props.onRetry}
        title="重  试"
        containerStyle={style.buttonContainer}
      />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  buttonContainer: {},
})

export default RetryView
