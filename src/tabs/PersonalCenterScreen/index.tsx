import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import Icons from '../../component/Icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  PERSONAL_INFO,
  RouterTypes,
  SERVER_AUTH_PAGE,
  SETTINGS_PAGE,
} from '../../router'
import Applications from './ApplicationsScreen'
import BaseContainer from '../../component/Container/BaseContainer'
import TradeLabel from './component/TradeLabel'
import BounceScrollView from '../../native/component/BounceScrollView'
import LinearGradient from 'react-native-linear-gradient'
import WtuLoginValidCard from './component/WtuLoginValidCard'
import WtuLoginInvalidCard from './component/WtuLoginInvalidCard'

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
  return (
    <View>
      <View style={[styles.header, { zIndex: 9999 }]}>
        <View style={styles.headerTextView}>
          <Image
            source={require('../../assets/img/studyCenter.png')}
            style={{ width: 26, height: 26 }}
          />
          {props.authenticated ? (
            <Pressable onPress={() => props.navigation.navigate(PERSONAL_INFO)}>
              <Text
                style={{
                  fontSize: global.styles.$font_size_lg,
                  color: global.styles.$text_color,
                  paddingStart: global.styles.$spacing_row_base,
                }}>
                {props.username}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => props.navigation.navigate(SERVER_AUTH_PAGE)}>
              <Text
                style={{
                  fontSize: global.styles.$font_size_lg,
                  color: global.styles.$text_color,
                  paddingStart: global.styles.$spacing_row_base,
                }}>
                未登录
              </Text>
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => props.navigation.navigate(SETTINGS_PAGE)}>
          <Icons
            iconText="&#xe600;"
            color={global.styles.$text_color}
            size={global.styles.$font_size_lg}
          />
        </Pressable>
      </View>
      <BounceScrollView>
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
      </BounceScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: global.styles.$bg_color,
    padding: global.styles.$spacing_col_sm,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
})

export default connect<StoreProps, {}, {}, ReducerTypes>(initialState => ({
  authenticated: initialState.serverUser.authenticated,
  username: initialState.serverUser.userInfo?.username,
  isWtuLoginValid: initialState.user.isLoginValid,
  wtuUsername: initialState.user.username,
}))(PersonalCenter)
