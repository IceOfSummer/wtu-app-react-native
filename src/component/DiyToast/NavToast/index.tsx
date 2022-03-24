import { RouterTypes } from '../../../router'
import React from 'react'
import Toast, {
  BaseToastProps,
  ErrorToast,
  ToastConfig,
  ToastConfigParams,
  ToastShowParams,
} from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'

type navToastProps = {
  routerName: string
}
/**
 * NavToast, 点击Toast后跳转到指定的路由处
 * 需要向props传递routerName属性
 */
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

/**
 * 显示可以进行导航的Toast
 */
export const showNavigationToast = (
  param: ToastShowParams & { routerName: keyof RouterTypes }
) =>
  Toast.show({
    ...param,
    type: NAV_TOAST,
    props: {
      routerName: param.routerName,
    },
  })
