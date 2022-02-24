import React from 'react'
import { Image, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { saveUserInfo } from '../../redux/actions/user'
import { ReducerTypes } from '../../redux/reducers'
import Icons from '../../utils/Icons'
import styles from './styles'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouterTypes, SCHOOL_AUTH } from '../../router'

interface StoreProps {
  username?: string
}
interface StoreActions {
  saveUserInfo: (...args: Parameters<typeof saveUserInfo>) => void
}

interface PersonalCenterProps
  extends StoreProps,
    StoreActions,
    NativeStackScreenProps<RouterTypes> {}

const PersonalCenter: React.FC<PersonalCenterProps> = props => {
  const t = () => {
    props.navigation.navigate(SCHOOL_AUTH)
    // props.navigation.push(SCHOOL_AUTH, {})
  }
  return (
    <View>
      <View style={{ ...styles.header }}>
        <View style={styles.headerTextView}>
          <Image
            source={require('../../assets/img/studyCenter.png')}
            style={{ width: 26, height: 26 }}
          />
          <View onTouchStart={t}>
            <Text
              style={{
                fontSize: global.styles.$font_size_lg,
                color: global.styles.$text_color,
                paddingStart: global.styles.$spacing_row_base,
              }}>
              {props.username ? props.username : '未登录'}
            </Text>
          </View>
        </View>
        <Icons
          iconText="&#xe600;"
          color={global.styles.$text_color}
          size={global.styles.$font_size_lg}
        />
      </View>
    </View>
  )
}

export default connect<StoreProps, StoreActions, {}, ReducerTypes>(
  initialState => ({
    username: initialState.user.username,
  }),
  { saveUserInfo }
)(PersonalCenter)
