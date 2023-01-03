import { Comment } from '../../route/RootArticle'
import React from 'react'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'
import { StyleSheet, Text, View } from 'react-native'
import Avatar from '../../../../component/Container/Avatar'
import Icons from '../../../../component/Icons'
import { formatTimestamp } from '../../../../utils/DateUtils'

interface CommentHeaderProps {
  item: Comment
  onPress?: (comment: Comment) => void
}

const CommentHeader: React.FC<CommentHeaderProps> = props => {
  const { item } = props
  const userInfo = useSelector<ReducerTypes, ServerUserInfo | undefined>(
    state => state.serverUser.userInfo
  )
  const showMoreBtn = userInfo && userInfo.uid === item.author
  return (
    <View style={styles.avatarContainer}>
      <View style={global.styles.flexRow}>
        <Avatar uid={item.author} />
        <Text style={styles.nickName}>{item.nickname}</Text>
      </View>
      <View style={styles.avatarRightContainer}>
        {showMoreBtn ? (
          <Icons
            iconText="&#xe8af;"
            size={30}
            onPress={() => props.onPress?.(props.item)}
          />
        ) : null}
        <Text>{formatTimestamp(item.createTime)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatarRightContainer: {
    alignItems: 'flex-end',
  },
  nickName: {
    fontSize: 15,
    color: global.colors.textColor,
    marginLeft: 5,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default CommentHeader
