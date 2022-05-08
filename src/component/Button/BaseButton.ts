import { ViewStyle } from 'react-native'

export interface BaseButtonProps {
  onPress?: () => void
  title: string
  containerStyle?: ViewStyle
}
