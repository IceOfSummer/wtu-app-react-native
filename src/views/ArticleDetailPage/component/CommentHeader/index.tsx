import { Comment } from '../../route/RootArticle'
import React from 'react'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'
import { StyleSheet, Text, View } from 'react-native'
import Avatar from '../../../../component/Container/Avatar'
import Icons from '../../../../component/Icons'

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
      <Avatar uid={item.author} />
      <Text style={styles.nickName}>{item.nickname}</Text>
      <View style={styles.avatarRightContainer}>
        {showMoreBtn ? (
          <Icons
            iconText="&#xe8af;"
            size={30}
            onPress={() => props.onPress?.(props.item)}
          />
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatarRightContainer: {
    position: 'absolute',
    right: 0,
    alignItems: 'flex-end',
    top: -20,
  },
  nickName: {
    fontSize: global.styles.$font_size_base,
    color: global.colors.textColor,
    marginLeft: 5,
    flex: 1,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: global.styles.$font_size_sm,
  },
})

export default CommentHeader
