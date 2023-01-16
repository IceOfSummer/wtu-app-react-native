import React, { useEffect } from 'react'
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import TabBar from '../tabs'
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native'
import PersonalInfo from '../views/PersonalInfo'
import DiyToast from '../component/DiyToast/NavToast'
import LessonsDetail from '../views/LessonsDetail'
import EmptyPage from '../views/EmptyPage'
import SettingsPage from '../views/SettingsPage'
import Webpage from '../views/Webpage'
import ScoreQueryPage from '../views/ScoreQueryPage'
import SubjectSelectPage from '../views/SubjectSelectPage'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import SearchPage from '../views/SearchPage'
import CommodityListPage from '../views/CommodityListPage'
import WebSchoolAuth from '../views/SchoolAuth/WebSchoolAuth'
import FullScreenImagePage from '../views/FullScreenImagePage'
import { IImageInfo } from 'react-native-image-zoom-viewer/src/image-viewer.type'
import UserInfoPage from '../views/UserInfoPage'
import { Theme } from '@react-navigation/native/lib/typescript/src/types'
import { ThemeState } from '../redux/types/themeTypes'
import ServerAuthPage from '../views/ServerAuthPage'
import ChatPage from '../views/ChatPage'
import { GoodsSubmitPage } from '../views/GoodsSubmitPage'
import commodityPage from '../views/CommodityPage'
import { StackHeaderOptions } from '@react-navigation/stack/lib/typescript/src/types'
import Icons from '../component/Icons'
import Order from '../views/Order'
import PostArticlePage from '../views/PostArticlePage'
import ArticleDetailPage from '../views/ArticleDetailPage'
import { CommunityMessageQueryType } from '../api/server/community'
import NavigationHeader from '../component/Container/NavigationHeader'
import { updateCurWeek } from '../redux/counter/lessonsTableSlice'
import { markCheckLoginDone } from '../redux/counter/temporaryDataSlice'
import { ReducerTypes } from '../redux/counter'
import { checkLogin } from '../redux/counter/wtuUserSlice'
import MessageTipPage from '../views/MessageTipPage'

const Stack = createNativeStackNavigator()

export const HOME_TABS = 'Home'
export const PERSONAL_CENTER_TABS = 'PersonalCenter'
export const CLASS_SCHEDULE_TABS = 'ClassSchedule'
export const MESSAGE_TABS = 'MessageScreen'
export const FLEA_MARKET_TABS = 'FleaMarket'
export const SCHOOL_AUTH = 'SchoolAuth'
export const PERSONAL_INFO = 'PersonalInfo'
export const LESSONS_DETAIL = 'LessonsDetail'
export const EMPTY_PAGE = 'EmptyPage'
export const SETTINGS_PAGE = 'SettingsPage'
export const WEB_PAGE = 'WebPage'
export const SCORE_QUERY = 'ScoreQuery'
export const SUBJECT_SELECT_PAGE = 'SubjectSelectPage'
export const SEARCH_PAGE = 'SearchPage'
export const COMMODITY_LIST_PAGE = 'CommodityListPage'
/**
 * @deprecated
 * @see COMMODITY_PAGE
 */
export const COMMODITY_DETAIL_PAGE = 'CommodityPage'
export const FULL_SCREEN_IMAGE_PAGE = 'FullScreenImagePage'
export const USER_INFO_PAGE = 'UserInfoPage'
export const SERVER_AUTH_PAGE = 'ServerAuthPage'
export const CHAT_PAGE = 'ChatPage'
export const GOODS_SUBMIT_PAGE = 'GoodsSubmitPage'
export const OPERATION_SUCCESS_PAGE = 'OperationSuccessPage'
export const COMMODITY_PAGE = 'CommodityPage'
export const ORDER_PAGE = 'OrderPage'
export const POST_ARTICLE_PAGE = 'PostArticlePage'
export const ARTICLE_DETAIL_PAGE = 'ArticleDetailPage'
export const MESSAGE_TIP_PAGE = 'MessageTipCheckPage'

export interface RouterTypes extends ParamListBase {
  [HOME_TABS]: undefined
  [PERSONAL_CENTER_TABS]: undefined
  [CLASS_SCHEDULE_TABS]: undefined
  [SCHOOL_AUTH]: undefined
  [PERSONAL_INFO]: undefined
  [LESSONS_DETAIL]: {
    /**
     * 第几周的课
     */
    week: number
    /**
     * 上课时间
     */
    startTime: number
  }
  [EMPTY_PAGE]: undefined
  [SETTINGS_PAGE]: undefined | { screen: string }
  [WEB_PAGE]: {
    url: string
  }
  [SCORE_QUERY]: undefined
  [SUBJECT_SELECT_PAGE]: undefined
  [FLEA_MARKET_TABS]: undefined
  [SEARCH_PAGE]: {
    placeholder?: string
  }
  [COMMODITY_LIST_PAGE]: {
    search: string
  }
  [FULL_SCREEN_IMAGE_PAGE]: {
    images: IImageInfo[]
    index?: number
  }
  [USER_INFO_PAGE]: {
    id: number
  }
  [MESSAGE_TABS]: undefined
  [CHAT_PAGE]: {
    /**
     * 和谁聊天
     */
    uid: number
  }
  [GOODS_SUBMIT_PAGE]: {
    /**
     * 当前用户id，用于确保用户登录了
     */
    uid: number
  }
  [OPERATION_SUCCESS_PAGE]: {
    title: string
    messages: string[]
    links?: Array<{ to: string; text: string }>
  }
  [COMMODITY_PAGE]: {
    id: number
  }
  [ORDER_PAGE]: undefined
  [ARTICLE_DETAIL_PAGE]: {
    prepared?: CommunityMessageQueryType
    manual?: {
      rootMessageId: number
    }
    isSubReply: boolean
    screen?: string
  }
  [MESSAGE_TIP_PAGE]: undefined
}
export type UseRouteGeneric<RouterName extends keyof RouterTypes> = RouteProp<
  Pick<RouterTypes, RouterName>
>
export type UseNavigationGeneric = NavigationProp<RouterTypes>

const headerCommonOptions: NativeStackNavigationOptions = {
  headerBackImageSource: require('../assets/img/back.png'),
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontSize: global.styles.$font_size_lg,
  },
  headerShadowVisible: false,
}
const hideHeaderOptions: NativeStackNavigationOptions = {
  header: () => null,
}

export const headerCommonOptionsWithTitle = (
  title: string,
  backgroundColor?: string
): NativeStackNavigationOptions => {
  return {
    header: props => (
      <NavigationHeader
        {...props}
        title={title}
        backgroundColor={backgroundColor}
      />
    ),
  }
}

export const headerWithTitle = (title: string): StackHeaderOptions => ({
  headerTitle: title,
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  headerBackImage: () => <Icons iconText="&#xe61d;" color="#000" size={40} />,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontSize: global.styles.$font_size_lg,
  },
})

const Router: React.FC = () => {
  const theme = useSelector<ReducerTypes, ThemeState>(state => state.theme)
  const navTheme: Theme = {
    colors: {
      background: theme.colors.backgroundColor,
      text: theme.colors.textColor,
      border: theme.colors.borderColor,
      card: '#fff',
      notification: '#fff',
      primary: theme.colors.primaryColor,
    },
    dark: theme.darkMode,
  }

  const store = useStore<ReducerTypes>()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      checkLogin(status => {
        if (status.isSuccess) {
          // 更新当前周
          const state = store.getState()
          dispatch(
            updateCurWeek({
              year: state.lessonsTable.options.year,
              term: state.lessonsTable.options.term,
            })
          )
        }
        store.dispatch(markCheckLoginDone())
      })
    )
  }, [])
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        defaultScreenOptions={{ header: () => null }}
        screenOptions={{
          headerTitleStyle: {
            fontSize: global.styles.$font_size_lg,
          },
        }}>
        <Stack.Screen
          name={HOME_TABS}
          component={TabBar}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name={SCHOOL_AUTH}
          component={WebSchoolAuth}
          options={hideHeaderOptions}
        />
        <Stack.Screen
          name={PERSONAL_INFO}
          component={PersonalInfo}
          options={headerCommonOptionsWithTitle('个人资料')}
        />
        <Stack.Screen
          name={LESSONS_DETAIL}
          component={LessonsDetail}
          options={headerCommonOptionsWithTitle('课程详细')}
        />
        <Stack.Screen
          name={EMPTY_PAGE}
          component={EmptyPage}
          options={headerCommonOptionsWithTitle('应用正在开发中')}
        />
        <Stack.Screen
          name={WEB_PAGE}
          component={Webpage}
          options={headerCommonOptionsWithTitle('加载中')}
        />
        <Stack.Screen
          name={SCORE_QUERY}
          component={ScoreQueryPage}
          options={headerCommonOptionsWithTitle('成绩查询')}
        />
        <Stack.Screen
          name={SUBJECT_SELECT_PAGE}
          component={SubjectSelectPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SEARCH_PAGE}
          component={SearchPage}
          options={hideHeaderOptions}
        />
        <Stack.Screen
          name={COMMODITY_LIST_PAGE}
          component={CommodityListPage}
          options={{ header: () => null, animation: 'none' }}
        />
        <Stack.Screen
          name={FULL_SCREEN_IMAGE_PAGE}
          component={FullScreenImagePage}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name={USER_INFO_PAGE}
          component={UserInfoPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SERVER_AUTH_PAGE}
          component={ServerAuthPage}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name={CHAT_PAGE}
          component={ChatPage}
          options={{
            animation: 'slide_from_right',
            ...headerCommonOptions,
            title: '',
          }}
        />
        <Stack.Screen
          name={GOODS_SUBMIT_PAGE}
          component={GoodsSubmitPage}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name={COMMODITY_PAGE}
          component={commodityPage}
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name={SETTINGS_PAGE}
          component={SettingsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ORDER_PAGE}
          component={Order}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={POST_ARTICLE_PAGE}
          component={PostArticlePage}
          options={{
            ...headerCommonOptionsWithTitle('发布帖子'),
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={ARTICLE_DETAIL_PAGE}
          component={ArticleDetailPage}
          options={{
            ...headerCommonOptionsWithTitle(
              '帖子详细',
              global.colors.boxBackgroundColor
            ),
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={MESSAGE_TIP_PAGE}
          component={MessageTipPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <DiyToast />
    </NavigationContainer>
  )
}

export default Router
