import { StackActions, useNavigation } from '@react-navigation/native'
import { RouterTypes, UseNavigationGeneric } from '../../router'

export type FunctionArgType<RouteName extends keyof RouterTypes> =
  undefined extends RouterTypes[RouteName]
    ? [screen: RouteName] | [screen: RouteName, params: RouterTypes[RouteName]]
    : [screen: RouteName, params: RouterTypes[RouteName]]

/**
 * 快速提供路由操作，包含replace和push
 */
const useNav = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  return {
    replace<RouteName extends keyof RouterTypes>(
      ...args: FunctionArgType<RouteName>
    ) {
      const routeName = args[0] as string
      nav.dispatch(StackActions.replace(routeName, args[1]))
    },
    push<RouteName extends keyof RouterTypes>(
      ...args: FunctionArgType<RouteName>
    ) {
      nav.navigate(...args)
    },
    pop() {
      if (nav.canGoBack()) {
        nav.goBack()
      }
    },
  }
}

export default useNav
