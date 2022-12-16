import React from 'react'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { StyleSheet, View } from 'react-native'
import CardContainer from '../../../../component/Cards/CardContainer'
import NavigationCard from '../../../../component/Cards/NavigationCard'
import CenterTextCard from '../../../../component/Cards/CenterTextCard'
import { markLoginInvalid } from '../../../../redux/counter/serverUserSlice'
import NativeDialog from '../../../../native/modules/NativeDialog'
import { useNavigation } from '@react-navigation/native'

const UserSettingPage: React.FC = () => {
  const store = useStore<ReducerTypes>()
  const nav = useNavigation()

  const info = store.getState().serverUser.userInfo
  if (!info) {
    return null
  }

  const logout = () => {
    NativeDialog.showDialog({
      title: '注销登录',
      message: '确定注销吗?',
      onConfirm() {
        store.dispatch(markLoginInvalid())
        nav.goBack()
      },
    })
  }

  return (
    <View>
      <CardContainer style={styles.container}>
        <NavigationCard title={'昵称: ' + info.nickname} />
        <NavigationCard hideBorder title={'绑定邮箱: ' + info.nickname} />
      </CardContainer>
      <CardContainer>
        <CenterTextCard
          title="退出登录"
          type="error"
          hideBorder
          onTap={logout}
        />
      </CardContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  imageBackground: {
    width: '100%',
    height: 300,
    position: 'absolute',
    top: 0,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  userInfoContainer: {
    marginLeft: 6,
  },
  nicknameText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_lg,
  },
})

export default UserSettingPage
