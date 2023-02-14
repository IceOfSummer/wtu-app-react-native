import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OrderPreviewPage from './route/OrderPreviewPage'
import PendingDeliveryPage from './route/PendingDeliveryPage'
import PendingReceivePage from './route/PendingReceivePage'
import { headerCommonOptionsWithTitle } from '../../router'
import SellingItemPage from './route/SellingItemPage'
import OrderDetailPage from './route/OrderDetailPage'
import { ParamListBase } from '@react-navigation/native'

const Stack = createNativeStackNavigator()

export const ORDER_PREVIEW_PAGE = '/OrderPage/OrderPreviewPage'
export const PENDING_DELIVERY_PAGE = '/OrderPage/PendingDeliveryPage'
export const PENDING_RECEIVE_PAGE = '/OrderPage/PendingReceivePage'
export const SELLING_ITEM_PAGE = '/OrderPage/SellingItemPage'
export const ORDER_DETAIL_PAGE = '/OrderPage/OrderDetail'

export interface OrderRouteParam extends ParamListBase {
  [ORDER_DETAIL_PAGE]: {
    /**
     * 订单id
     */
    oid: number
  }
}

const Order: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={PENDING_RECEIVE_PAGE}
        component={PendingReceivePage}
        options={headerCommonOptionsWithTitle(
          '待收货',
          global.colors.boxBackgroundColor
        )}
      />
      <Stack.Screen
        name={PENDING_DELIVERY_PAGE}
        component={PendingDeliveryPage}
        options={headerCommonOptionsWithTitle(
          '待发货',
          global.colors.boxBackgroundColor
        )}
      />
      <Stack.Screen
        name={ORDER_PREVIEW_PAGE}
        component={OrderPreviewPage}
        options={headerCommonOptionsWithTitle(
          '我的订单',
          global.colors.boxBackgroundColor
        )}
      />
      <Stack.Screen
        name={SELLING_ITEM_PAGE}
        component={SellingItemPage}
        options={headerCommonOptionsWithTitle(
          '我的商品',
          'rgb(33, 150, 243)',
          '#fff'
        )}
      />
      <Stack.Screen
        name={ORDER_DETAIL_PAGE}
        component={OrderDetailPage}
        options={headerCommonOptionsWithTitle(
          '订单详细',
          global.colors.boxBackgroundColor
        )}
      />
    </Stack.Navigator>
  )
}

export default Order
