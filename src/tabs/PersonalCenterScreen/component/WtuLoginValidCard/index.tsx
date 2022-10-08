import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import Icons from '../../../../component/Icons'
import { logoutEduSystem } from '../../../../api/edu/auth'
import { markLoginExpired } from '../../../../redux/counter/wtuUserSlice'
import NativeDialog from '../../../../native/modules/NativeDialog'

const WtuLoginValidCard: React.FC = () => {
  const store = useStore<ReducerTypes>()
  const { username } = store.getState().user
  const logOut = () => {
    NativeDialog.showDialog({
      title: '登出教务系统',
      message: '确定登出吗?',
      onConfirm() {
        logoutEduSystem().then(() => {
          store.dispatch(markLoginExpired())
        })
      },
    })
  }

  return (
    <View style={global.styles.flexRowJustBetween}>
      <View>
        <Text style={styles.titleText}>教务系统已登录</Text>
        <KVTextContainer name="用户名" value={username} />
      </View>
      <View style={global.styles.flexRow}>
        <Text onPress={logOut} style={styles.exitText}>
          登出
        </Text>
        <Icons iconText="&#xe61c;" color="#ff8e57" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  titleText: {
    color: '#fff',
    fontSize: global.styles.$font_size_lg,
    marginBottom: global.styles.$spacing_col_base,
  },
  exitText: {
    color: '#ff8e57',
  },
})

export default WtuLoginValidCard
