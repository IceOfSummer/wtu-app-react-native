import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SubmitPage from './route/SubmitPage'
import SubmitSuccessPage from './route/SubmitSuccessPage'
import { ParamListBase, useRoute } from '@react-navigation/native'
import {
  GOODS_SUBMIT_PAGE,
  headerCommonOptionsWithTitle,
  UseRouteGeneric,
} from '../../router'
import useAutoColorStatusBar from '../../hook/useAutoColorStatusBar'

const Stack = createNativeStackNavigator()

const INITIAL_ROUTE_NAME = 'submitPage'
export const SUBMIT_PAGE = '/GoodsSubmitPage/submitPage'
export const SUCCESS_PAGE = '/GoodsSubmitPage/successPage'

export interface SubmitPageRouteTypes extends ParamListBase {
  [SUBMIT_PAGE]: { uid: number }
  [SUCCESS_PAGE]: { commodityId: number }
}

export const GoodsSubmitPage: React.FC = () => {
  const route = useRoute<UseRouteGeneric<typeof GOODS_SUBMIT_PAGE>>()
  useAutoColorStatusBar(false, '#fff')
  return (
    <Stack.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <Stack.Screen
        name={SUBMIT_PAGE}
        component={SubmitPage}
        initialParams={{ uid: route.params.uid }}
        options={headerCommonOptionsWithTitle('提交商品')}
      />
      <Stack.Screen
        name={SUCCESS_PAGE}
        component={SubmitSuccessPage}
        options={headerCommonOptionsWithTitle('提交成功')}
      />
    </Stack.Navigator>
  )
}
