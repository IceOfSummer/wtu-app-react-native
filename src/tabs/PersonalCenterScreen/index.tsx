import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import Icons from '../../component/Icons'
import styles from './styles'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  PERSONAL_INFO,
  RouterTypes,
  SCHOOL_AUTH,
  SETTINGS_PAGE,
} from '../../router'
import Applications from './ApplicationsScreen'

interface StoreProps {
  username?: string
  expired: boolean
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
          {props.expired ? (
            <Pressable
              onPress={() => props.navigation.navigate(SCHOOL_AUTH)}
              key={SCHOOL_AUTH}>
              <Text
                style={{
                  fontSize: global.styles.$font_size_lg,
                  color: global.styles.$text_color,
                  paddingStart: global.styles.$spacing_row_base,
                }}>
                {props.username ? `${props.username}(已过期)` : '未登录'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => props.navigation.navigate(PERSONAL_INFO)}
              key={PERSONAL_INFO}>
              <Text
                style={{
                  fontSize: global.styles.$font_size_lg,
                  color: global.styles.$text_color,
                  paddingStart: global.styles.$spacing_row_base,
                }}>
                {props.username}
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
      <View style={{ zIndex: 1 }}>
        <Applications />
      </View>
    </View>
  )
}

export default connect<StoreProps, {}, {}, ReducerTypes>(initialState => ({
  username: initialState.user.username,
  expired: !initialState.user.isLoginValid,
}))(PersonalCenter)
