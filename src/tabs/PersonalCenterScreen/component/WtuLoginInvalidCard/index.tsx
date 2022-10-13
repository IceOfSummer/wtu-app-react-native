import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import Icons from '../../../../component/Icons'
import useNav from '../../../../hook/useNav'
import { SCHOOL_AUTH } from '../../../../router'

const WtuLoginInvalidCard: React.FC = () => {
  const store = useStore<ReducerTypes>()
  const { username } = store.getState().user
  const nav = useNav()

  const doWtuLogin = () => {
    nav.push(SCHOOL_AUTH)
  }

  if (username) {
    return (
      <View style={global.styles.flexRowJustBetween}>
        <View>
          <Text style={styles.titleText}>教务系统登录过期</Text>
          <KVTextContainer name="上次登录账号" value={username} />
        </View>
        <View style={global.styles.flexRow}>
          <Text onPress={doWtuLogin} style={styles.exitText}>
            登录
          </Text>
          <Icons iconText="&#xe61c;" color="#fff" />
        </View>
      </View>
    )
  }
  return (
    <View style={global.styles.flexRowJustBetween}>
      <View>
        <Text style={styles.titleText}>登录教务系统</Text>
        <Text style={styles.tipText}>登录后获取更多支持</Text>
      </View>
      <View style={global.styles.flexRow}>
        <Text onPress={doWtuLogin} style={styles.exitText}>
          登录
        </Text>
        <Icons iconText="&#xe61c;" color="#fff" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  titleText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: global.styles.$font_size_lg,
    marginBottom: global.styles.$spacing_col_base,
  },
  exitText: {
    color: '#fff',
  },
  tipText: {
    color: '#fff',
  },
})
export default WtuLoginInvalidCard
