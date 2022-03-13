import { RouterTypes } from '../../router'
import React from 'react'
import Toast, {
  BaseToastProps,
  ErrorToast,
  ToastConfig,
  ToastConfigParams,
} from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'

type navToastProps = {
  routerName: string
}
export const NAV_TOAST = 'NavToast'
const NavToast: React.FC<
  ToastConfigParams<BaseToastProps & navToastProps>
> = props => {
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  props.onPress = () => {
    nav.navigate(props.props.routerName)
    props.hide()
  }
  return <ErrorToast {...props} />
}

const MyToastConfig: ToastConfig = {
  [NAV_TOAST]: NavToast,
}

const DiyToast: React.FC = () => {
  return <Toast config={MyToastConfig} />
}

export default DiyToast
