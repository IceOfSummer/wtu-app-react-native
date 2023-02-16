import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ParamListBase } from '@react-navigation/native'
import SubmitPage from './route/SubmitPage'
import { SuccessPage } from './route/SuccessPage'
import { headerCommonOptionsWithTitle } from '../../router'
import DetailPage from './route/DetailPage'

const Stack = createNativeStackNavigator()

export const DETAIL_PAGE = '/acquisitionPage/detail'
const SUBMIT_PAGE = '/acquisitionPage/submit'
export const SUBMIT_SUCCESS_PAGE = '/acquisitionPage/submitSuccess'
export interface AcquisitionSubmitPageRoute extends ParamListBase {
  [DETAIL_PAGE]: { acquisitionId: number; nickname: string }
  [SUBMIT_PAGE]: undefined
  [SUBMIT_SUCCESS_PAGE]: { acquisitionId: number }
}

const AcquisitionSubmitPage: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={SUBMIT_PAGE}>
      <Stack.Screen
        name={SUBMIT_PAGE}
        component={SubmitPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SUBMIT_SUCCESS_PAGE}
        component={SuccessPage}
        options={headerCommonOptionsWithTitle('发布成功')}
      />
      <Stack.Screen
        name={DETAIL_PAGE}
        component={DetailPage}
        options={headerCommonOptionsWithTitle(
          '收购详细',
          global.colors.boxBackgroundColor
        )}
      />
    </Stack.Navigator>
  )
}
export default AcquisitionSubmitPage
