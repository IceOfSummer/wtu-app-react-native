import React from 'react'
import { ColorValue, Text, View } from 'react-native'

interface KVTextContainerProps {
  name: string
  value: string | number
  keyColor?: ColorValue
}

const defaultProps = {
  valueColor: '#000',
  delimiter: ': ',
}

const KVTextContainer: React.FC<
  KVTextContainerProps & Partial<typeof defaultProps>
> = props => {
  console.log(props.valueColor)
  return (
    <View style={global.styles.flexRow}>
      <Text
        style={{ color: props.keyColor, fontSize: 12 }}
        numberOfLines={1}
        ellipsizeMode="tail">
        {props.name}
        {props.delimiter}
      </Text>
      <Text
        style={{ color: props.valueColor, fontSize: 12 }}
        numberOfLines={1}
        ellipsizeMode="tail">
        {props.value}
      </Text>
    </View>
  )
}

KVTextContainer.defaultProps = defaultProps
export default KVTextContainer
