import { Comment } from '../../route/RootArticle'
import React from 'react'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { StyleSheet, Text, View } from 'react-native'
import Avatar from '../../../../component/Container/Avatar'
import Icons from '../../../../component/Icons'

interface CommentHeaderProps {
  item: Comment
  onPress?: (comment: Comment) => void
}

const CommentHeader: React.FC<CommentHeaderProps> = props => {
  const { item } = props
  const store = useStore<ReducerTypes>()
  const state = store.getState()
  const userInfo = state.serverUser.userInfo
  const isAdmin = state.serverUser.isAdmin
  const showMoreBtn = isAdmin || (userInfo && userInfo.uid === item.author)
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
