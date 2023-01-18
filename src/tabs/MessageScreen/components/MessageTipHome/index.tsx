import React, { useRef } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { useNavigation } from '@react-navigation/native'
import {
  LIKE_CHECK_PAGE,
  MessageTipPageRouteParam,
  REPLY_PAGE,
  SYSTEM_MESSAGE_PAGE,
} from '../../../../views/MessageTipPage'
import { MESSAGE_TIP_PAGE, UseNavigationGeneric } from '../../../../router'
import NavigationHeader from '../../../../component/Container/NavigationHeader'
import Chat from '../Chat'
import ConnectFailView from '../ConnectFailView'
import Icons from '../../../../component/Icons'
import BottomMenu, { MenuItem } from '../../../../component/Drawer/BottomMenu'
import Drawer from '../../../../component/Drawer'
import { clearAllRemind } from '../../../../redux/counter/eventRemindSlice'
import { markMessageAllRead } from '../../../../redux/counter/messageSlice'

const ITEMS: MenuItem[] = [{ name: '全部已读', icon: '&#xe731;' }]

const MessageTipHome: React.FC = () => {
  const nav = useNavigation()
  const menuDrawer = useRef<Drawer>(null)
  const dispatch = useDispatch()
  const likeCount = useSelector<ReducerTypes, number>(
    state => state.eventRemind.likeMessageCount
  )
  const replyCount = useSelector<ReducerTypes, number>(
    state => state.eventRemind.replyMessageCount
  )
  const sysMsgCount = useSelector<ReducerTypes, number>(
    state => state.eventRemind.systemMessageCount
  )

  const onMenuSelect = (index: number) => {
    if (index === 0) {
      dispatch(clearAllRemind())
      dispatch(markMessageAllRead())
    }
    menuDrawer.current?.closeDrawer()
  }

  const moreBtnPress = () => {
    menuDrawer.current?.showDrawer()
  }

  return (
    <View style={styles.outerContainer}>
      <NavigationHeader
        title="消息"
        navigation={nav}
        hideBackButton
        showSplitLine>
        <Icons iconText="&#xe8af;" size={30} onPress={moreBtnPress} />
      </NavigationHeader>
      <ConnectFailView />
      <SpringScrollView>
        <View style={styles.headerContainer}>
          <NavigationCard
            to={LIKE_CHECK_PAGE}
            tipCount={likeCount}
            text="收到的赞"
            image={require('../../../../assets/img/like_blue.png')}
          />
          <NavigationCard
            to={REPLY_PAGE}
            tipCount={replyCount}
            text="回复我的"
            image={require('../../../../assets/img/message_blue.png')}
          />
          <NavigationCard
            to={SYSTEM_MESSAGE_PAGE}
            tipCount={sysMsgCount}
            text="系统消息"
            image={require('../../../../assets/img/planet_blue.png')}
          />
        </View>
        <Chat />
      </SpringScrollView>
      <Drawer ref={menuDrawer}>
        <BottomMenu onSelect={onMenuSelect} items={ITEMS} title="快捷选项" />
      </Drawer>
    </View>
  )
}

interface NavigationCardProps {
  to: keyof MessageTipPageRouteParam
  image: any
  text: Displayable
  tipCount: number
}

const NavigationCard: React.FC<NavigationCardProps> = props => {
  const nav = useNavigation<UseNavigationGeneric>()
  const jump = () => {
    nav.navigate(MESSAGE_TIP_PAGE, { screen: props.to })
  }

  return (
    <View style={styles.navCardContainer}>
      <Pressable onPress={jump}>
        <Image source={props.image} style={styles.image} />
      </Pressable>
      <Text>{props.text}</Text>
      {props.tipCount === 0 ? null : (
        <Text style={styles.tipCount}>{props.tipCount}</Text>
      )}
    </View>
  )
}

const LENGTH = 60
const TIP_LENGTH = 18
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: global.colors.boxBackgroundColor,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: LENGTH,
    height: LENGTH,
    marginBottom: 4,
  },
  navCardContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  tipCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#fff',
    backgroundColor: 'red',
    borderRadius: TIP_LENGTH,
    width: TIP_LENGTH,
    height: TIP_LENGTH,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})

export default MessageTipHome
