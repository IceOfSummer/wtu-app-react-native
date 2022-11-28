import React from 'react'
import { ParamListBase, useRoute } from '@react-navigation/native'
import CommodityDetail from './route/CommodityDetail'
import { COMMODITY_PAGE, headerWithTitle, UseRouteGeneric } from '../../router'
import { ProcessedCommodity } from '../../api/server/commodity'
import ConfirmPage from './route/ConfirmPage'
import { createStackNavigator } from '@react-navigation/stack'
import DrawerPage from './route/FormDrawerPage'
import LockSuccessPage from './route/LockSuccessPage'

const Stack = createStackNavigator()
const INITIAL_ROUTE_NAME = ''
export const DETAIL_PAGE = '/Commodity/detail'
export const CONFIRM_PAGE = '/Commodity/confirm'
export const FORM_DRAWER_PAGE = '/Commodity/drawer'
export const LOCK_SUCCESS_PAGE = '/Commodity/LockSuccess'

export interface CommodityPageRouteTypes extends ParamListBase {
  [DETAIL_PAGE]: { id: number }
  [CONFIRM_PAGE]: {
    remark: string
    commodity: ProcessedCommodity
    count: number
  }
  [FORM_DRAWER_PAGE]: { commodity: ProcessedCommodity }
  [LOCK_SUCCESS_PAGE]: {
    orderId: number
    sellerId: number
  }
}

const CommodityPage: React.FC = () => {
  const route = useRoute<UseRouteGeneric<typeof COMMODITY_PAGE>>()
  return (
    <Stack.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen
          name={DETAIL_PAGE}
          component={CommodityDetail}
          initialParams={{ id: route.params.id }}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name={CONFIRM_PAGE}
          component={ConfirmPage}
          options={headerWithTitle('确认订单')}
        />
        <Stack.Screen
          name={LOCK_SUCCESS_PAGE}
          component={LockSuccessPage}
          options={headerWithTitle('锁定成功')}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
        }}>
        <Stack.Screen name={FORM_DRAWER_PAGE} component={DrawerPage} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default CommodityPage
