import React from 'react'
import { Image, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { saveUserInfo } from '../../redux/actions/user'
import { ReducerTypes } from '../../redux/reducers'
import Icons from '../../utils/Icons'
import styles from './styles'

interface StoreProps {
  username?: string
}
interface StoreActions {
  saveUserInfo: (...args: Parameters<typeof saveUserInfo>) => void
}
interface PersonalCenterProps extends StoreProps, StoreActions {}

const PersonalCenter: React.FC<PersonalCenterProps> = props => {
  return (
    <View style={{ ...styles.header }}>
      <View style={styles.headerTextView}>
        <Image
          source={require('../../assets/img/studyCenter.png')}
          style={{ width: 26, height: 26 }}
        />
        <View>
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
  )
}

export default connect<StoreProps, StoreActions, {}, ReducerTypes>(
  initialState => ({
    username: initialState.user.username,
  }),
  { saveUserInfo }
)(PersonalCenter)
