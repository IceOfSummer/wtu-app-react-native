import React from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { connect, useSelector } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import Icons from '../../component/Icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  RouterTypes,
  SERVER_AUTH_PAGE,
  SETTINGS_PAGE,
  UseNavigationGeneric,
} from '../../router'
import Applications from './ApplicationsScreen'
import BaseContainer from '../../component/Container/BaseContainer'
import TradeLabel from './component/TradeLabel'
import LinearGradient from 'react-native-linear-gradient'
import WtuLoginValidCard from './component/WtuLoginValidCard'
import WtuLoginInvalidCard from './component/WtuLoginInvalidCard'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { useNavigation } from '@react-navigation/native'
import Avatar, { getAvatarUrl } from '../../component/Container/Avatar'
import { ServerUserInfo } from '../../redux/types/serverUserTypes'
import { USER_SETTINGS_PAGE } from '../../views/SettingsPage'

interface StoreProps {
  authenticated: boolean
  username: string | undefined
  isWtuLoginValid?: boolean
  wtuUsername?: string
}

interface PersonalCenterProps
  extends StoreProps,
    NativeStackScreenProps<RouterTypes> {}

const PersonalCenter: React.FC<PersonalCenterProps> = props => {
  const nav = useNavigation<UseNavigationGeneric>()
  const auth = useSelector<ReducerTypes, boolean>(
    state => state.serverUser.authenticated
  )
  const userInfo = useSelector<ReducerTypes, ServerUserInfo | undefined>(
    state => state.serverUser.userInfo
  )
  const toUserSettingPage = () => {
    if (auth) {
      nav.navigate(SETTINGS_PAGE, { screen: USER_SETTINGS_PAGE })
    }
  }

  const toAuthPage = () => {
    if (!auth) {
      nav.navigate(SERVER_AUTH_PAGE)
    }
  }

  let userNickname
  if (auth) {
    userNickname = userInfo ? userInfo.nickname : '用户'
  } else {
    userNickname = '未登录'
  }
  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <SpringScrollView contentStyle={{ flex: 1 }}>
        <ImageBackground
          source={require('../../assets/img/user_banner.jpg')}
          style={styles.imageBackground}
        />
        <LinearGradient
          colors={['#ffffff00', '#ffffff']}
          style={styles.imageBackground}
        />
        <View style={styles.headerContainer}>
          <View style={global.styles.flexRow}>
            <Avatar
              size={60}
              uri={userInfo ? getAvatarUrl(userInfo.uid) : undefined}
            />
            <View style={styles.userInfoContainer}>
              <View style={global.styles.flexRow}>
                <Text style={styles.nicknameText} onPress={toAuthPage}>
                  {userNickname}
                </Text>
                {auth ? (
                  <Icons
                    iconText="&#xe610;"
                    size={20}
                    onPress={toUserSettingPage}
                  />
                ) : null}
              </View>
              <Text>{userInfo ? userInfo.uid : ''}</Text>
            </View>
          </View>
          <Pressable onPress={() => props.navigation.navigate(SETTINGS_PAGE)}>
            <Icons
              iconText="&#xe600;"
              color={global.styles.$text_color}
              size={global.styles.$font_size_lg}
            />
          </Pressable>
        </View>
        <LinearGradient
          style={styles.wtuBox}
          colors={['#36D1DC', '#5B86E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          {props.isWtuLoginValid ? (
            <WtuLoginValidCard />
          ) : (
            <WtuLoginInvalidCard />
          )}
        </LinearGradient>
        {props.authenticated ? (
          <BaseContainer>
            <TradeLabel />
          </BaseContainer>
        ) : null}
        <View style={{ zIndex: 1 }}>
          <Applications />
        </View>
      </SpringScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wtuBox: {
    marginHorizontal: global.styles.$spacing_row_sm,
    marginVertical: global.styles.$spacing_col_lg,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
  },
  cardText: {
    color: '#fff',
    fontSize: global.styles.$font_size_lg,
  },
  imageBackground: {
    width: '100%',
    height: 300,
    position: 'absolute',
    top: 0,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 30,
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    marginLeft: 6,
  },
  nicknameText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_lg,
  },
})

export default connect<StoreProps, {}, {}, ReducerTypes>(initialState => ({
  authenticated: initialState.serverUser.authenticated,
  username: initialState.serverUser.userInfo?.username,
  isWtuLoginValid: initialState.user.isLoginValid,
  wtuUsername: initialState.user.username,
}))(PersonalCenter)
