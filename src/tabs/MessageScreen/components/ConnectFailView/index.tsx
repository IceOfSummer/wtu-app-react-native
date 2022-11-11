import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'

const ConnectFailView: React.FC = () => {
  const isFail = useSelector<ReducerTypes, boolean>(
    state => !!state.temporary.isChatServerConnectFailed
  )

  return (
    <View
      style={[styles.tipViewContainer, { display: isFail ? 'flex' : 'none' }]}>
      <ActivityIndicator color="#fff" />
      <Text style={styles.tipText}>连接服务器失败</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tipViewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.5)',
    paddingVertical: global.styles.$spacing_col_base,
  },
  tipText: {
    paddingLeft: global.styles.$spacing_row_sm,
    color: '#fff',
    textAlign: 'center',
  },
})

export default ConnectFailView
