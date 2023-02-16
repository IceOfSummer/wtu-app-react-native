import React from 'react'
import { ColorValue, Text, TextStyle, View, ViewStyle } from 'react-native'
import Icons from '../../Icons'

interface KVTextContainerProps {
  name: string
  value?: string | number
  keyColor?: ColorValue
  icon?: string
  style?: ViewStyle
  valueStyles?: TextStyle
  onPress?: () => void
}

const defaultProps = {
  valueColor: '#000',
  delimiter: ': ',
  fontSize: 12,
}

const KVTextContainer: React.FC<
  KVTextContainerProps & Partial<typeof defaultProps>
> = props => {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, props.style]}>
      <Icons
        iconText={props.icon}
        size={props.fontSize ? props.fontSize + 3 : 13}
      />
      <Text
        style={{ color: props.keyColor, fontSize: props.fontSize }}
        numberOfLines={1}
        ellipsizeMode="tail">
        {props.name}
        {props.delimiter}
      </Text>
      <Text
        selectable
        onPress={props.onPress}
        style={[
          { color: props.valueColor, fontSize: props.fontSize },
          props.valueStyles,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail">
        {props.value}
      </Text>
    </View>
  )
}

KVTextContainer.defaultProps = defaultProps
export default KVTextContainer
