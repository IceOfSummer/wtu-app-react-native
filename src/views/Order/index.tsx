import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OrderPreviewPage from './route/OrderPreviewPage'
import PendingDeliveryPage from './route/PendingDeliveryPage'
import PendingReceivePage from './route/PendingReceivePage'
import { headerCommonOptionsWithTitle } from '../../router'
import SellingItemPage from './route/SellingItemPage'

const Stack = createNativeStackNavigator()

export const ORDER_PREVIEW_PAGE = '/OrderPage/OrderPreviewPage'
export const PENDING_DELIVERY_PAGE = '/OrderPage/PendingDeliveryPage'
export const PENDING_RECEIVE_PAGE = '/OrderPage/PendingReceivePage'
export const SELLING_ITEM_PAGE = '/OrderPage/SellingItemPage'
const Order: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={PENDING_RECEIVE_PAGE}
        component={PendingReceivePage}
        options={headerCommonOptionsWithTitle('待收货')}
      />
      <Stack.Screen
        name={PENDING_DELIVERY_PAGE}
        component={PendingDeliveryPage}
        options={headerCommonOptionsWithTitle('待发货')}
      />
      <Stack.Screen
        name={ORDER_PREVIEW_PAGE}
        component={OrderPreviewPage}
        options={headerCommonOptionsWithTitle('我的订单')}
      />
      <Stack.Screen
        name={SELLING_ITEM_PAGE}
        component={SellingItemPage}
        options={headerCommonOptionsWithTitle('我的商品')}
      />
    </Stack.Navigator>
  )
}

export default Order
