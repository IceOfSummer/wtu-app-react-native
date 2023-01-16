import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ReplyPage from './route/ReplyPage'
import LikeCheckPage from './route/LikeCheckPage'
import SystemMessagePage from './route/SystemMessagePage'
import MessageTipHome from './route/MessageTipHome'
import { headerCommonOptionsWithTitle } from '../../router'

export const MESSAGE_TIP_HOME = '/messageTipPage/home'
export const REPLY_PAGE = '/messageTipPage/replyPage'
export const LIKE_CHECK_PAGE = '/messageTipPage/likeCheckPage'
export const SYSTEM_MESSAGE_PAGE = '/messageTipPage/systemMessagePage'

export interface MessageTipPageRouteParam {
  [MESSAGE_TIP_HOME]: undefined
  [REPLY_PAGE]: undefined
  [LIKE_CHECK_PAGE]: undefined
  [SYSTEM_MESSAGE_PAGE]: undefined
}
const Stack = createNativeStackNavigator()

const MessageTipPage: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={MESSAGE_TIP_HOME}>
      <Stack.Screen
        name={MESSAGE_TIP_HOME}
        component={MessageTipHome}
        options={headerCommonOptionsWithTitle(
          '消息',
          global.colors.boxBackgroundColor
        )}
      />
      <Stack.Screen
        name={LIKE_CHECK_PAGE}
        component={LikeCheckPage}
        options={headerCommonOptionsWithTitle(
          '收到的赞',
          global.colors.boxBackgroundColor
        )}
      />
      <Stack.Screen
        name={REPLY_PAGE}
        component={ReplyPage}
        options={headerCommonOptionsWithTitle(
          '回复我的',
          global.colors.boxBackgroundColor
        )}
      />
      <Stack.Screen
        name={SYSTEM_MESSAGE_PAGE}
        component={SystemMessagePage}
        options={headerCommonOptionsWithTitle(
          '系统消息',
          global.colors.boxBackgroundColor
        )}
      />
    </Stack.Navigator>
  )
}

export default MessageTipPage
