import React, { useRef, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import RootArticle from './route/RootArticle'
import {
  ParamListBase,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { ARTICLE_DETAIL_PAGE, RouterTypes, UseRouteGeneric } from '../../router'
import { StyleSheet, Text, View } from 'react-native'
import Icons from '../../component/Icons'
import { StackHeaderProps } from '@react-navigation/stack/src/types'
import SubReplyDetail from './route/SubReplyDetail'
import { Comment } from './component/CommentContainer'
import ReplyDrawer, { OpenDrawerParam } from './component/ReplyDrawer'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import { ServerUserInfo } from '../../redux/types/serverUserTypes'
import Toast from 'react-native-root-toast'
import MessageMenu from './component/MessageMenu'

const Stack = createStackNavigator()

export const ROOT_ARTICLE_PAGE = '/ArticleDetailPage/RootArticle'
export const COMMENT_DETAIL_PAGE = '/ArticleDetailPage/CommentDetailPage'

type RouteParam = Pick<RouterTypes, 'ArticleDetailPage'>['ArticleDetailPage']

export interface ArticleDetailRouteType extends ParamListBase {
  [COMMENT_DETAIL_PAGE]: RouteParam
  [ROOT_ARTICLE_PAGE]: RouteParam
}

export type ArticleDetailContext = {
  /**
   * uid -> nickname
   */
  uidMapToNickname: Map<number, string>
  /**
   * messageId -> author
   */
  msgIdMapToUser: Map<number, { uid: number; nickname: string }>
  /**
   * message -> 踩/赞
   */
  messageAttitude: Map<number, 0 | 1>
  /**
   * 一级评论
   */
  comments: Comment[]
  /**
   * 二级评论
   */
  subComments: Comment[]
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>
  setSubComments: React.Dispatch<React.SetStateAction<Comment[]>>
  openReplyDrawer: (comment: OpenDrawerParam) => void
  openMessageMenu: (comment: Comment, isRoot: boolean) => void
}

const msgIdMapToUser = new Map()
const uidMapToNickname = new Map()
const messageAttitude = new Map()
export const MsgInfoContext = React.createContext<ArticleDetailContext>({
  msgIdMapToUser,
  uidMapToNickname,
  messageAttitude,
  comments: [],
  subComments: [],
  setComments: () => {},
  setSubComments: () => {},
  openReplyDrawer: () => {},
  openMessageMenu: () => {},
})

// 在这里声明是为了避免依赖循环
ReplyDrawer.contextType = MsgInfoContext
MessageMenu.contextType = MsgInfoContext

const ArticleDetailPage: React.FC = () => {
  const route = useRoute<UseRouteGeneric<typeof ARTICLE_DETAIL_PAGE>>()
  const [comments, setComments] = useState<Comment[]>([])
  const [subComments, setSubComments] = useState<Comment[]>([])
  const userInfo = useSelector<ReducerTypes, ServerUserInfo | undefined>(
    state => state.serverUser.userInfo
  )
  const nav = useNavigation()
  const messageMenu = useRef<MessageMenu>(null)
  const replyDrawer = useRef<ReplyDrawer>(null)
  const openReplyDrawer = (param: OpenDrawerParam) => {
    if (!userInfo) {
      Toast.show('请先登录')
      return
    }
    replyDrawer.current?.openReplyDrawer(param)
  }

  const openMessageMenu = (comment: Comment, isRoot: boolean) => {
    messageMenu.current?.openMenu(comment, isRoot)
  }

  return (
    <MsgInfoContext.Provider
      value={{
        msgIdMapToUser,
        uidMapToNickname,
        messageAttitude,
        comments,
        subComments,
        setSubComments,
        setComments,
        openReplyDrawer,
        openMessageMenu,
      }}>
      <Stack.Navigator initialRouteName={ROOT_ARTICLE_PAGE}>
        <Stack.Screen
          name={ROOT_ARTICLE_PAGE}
          component={RootArticle}
          options={{ headerShown: false }}
          initialParams={route.params}
        />
        <Stack.Screen
          name={COMMENT_DETAIL_PAGE}
          component={SubReplyDetail}
          options={{ header: Header }}
          initialParams={route.params}
        />
      </Stack.Navigator>
      <ReplyDrawer ref={replyDrawer} userInfo={userInfo} />
      <MessageMenu ref={messageMenu} navigation={nav} />
    </MsgInfoContext.Provider>
  )
}

const Header: React.FC<StackHeaderProps> = props => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>评论详细</Text>
      <Icons iconText="&#xe612;" size={26} onPress={props.navigation.goBack} />
    </View>
  )
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'space-between',
    backgroundColor: global.colors.boxBackgroundColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: global.colors.borderColor,
  },
  title: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
})
export default ArticleDetailPage
