import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Avatar, { getAvatarUrl } from '../../../../component/Container/Avatar'
import { formatTimestamp } from '../../../../utils/DateUtils'

interface RowAvatarProps {
  author: number
  nickname: string
  createTime: number
}

const RowAvatar: React.FC<RowAvatarProps> = props => {
  return (
    <View style={styles.avatarContainer}>
      <View style={global.styles.flexRow}>
        <Avatar uri={getAvatarUrl(props.author)} />
        <Text style={styles.nickName}>{props.nickname}</Text>
      </View>
      <Text>{formatTimestamp(props.createTime)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nickName: {
    fontSize: 15,
    color: global.colors.textColor,
    marginLeft: 5,
  },
})

export default RowAvatar
