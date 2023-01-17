import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ReplyPage from './route/ReplyPage'
import SystemMessagePage from './route/SystemMessagePage'
import { headerCommonOptionsWithTitle } from '../../router'
import LikeCheckPage from './route/LikeCheckPage'

export const REPLY_PAGE = '/messageTipPage/replyPage'
export const LIKE_CHECK_PAGE = '/messageTipPage/likeCheckPage'
export const SYSTEM_MESSAGE_PAGE = '/messageTipPage/systemMessagePage'

export interface MessageTipPageRouteParam {
  [REPLY_PAGE]: undefined
  [LIKE_CHECK_PAGE]: undefined
  [SYSTEM_MESSAGE_PAGE]: undefined
}
const Stack = createNativeStackNavigator()

const MessageTipPage: React.FC = () => {
  return (
    <Stack.Navigator>
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
