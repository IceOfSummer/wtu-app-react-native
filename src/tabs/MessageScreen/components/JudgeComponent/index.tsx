import React, { useState } from 'react'
import { CommunityMessageQueryType } from '../../../../api/server/community'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Icons from '../../../../component/Icons'

interface JudgeComponentProps {
  item: CommunityMessageQueryType
}

/**
 * 1: 喜欢，0: 不喜欢
 */
type Attitude = undefined | 1 | 0

/**
 * 点赞/踩组件
 */
const JudgeComponent: React.FC<JudgeComponentProps> = props => {
  const { item } = props
  const [likeCount, setLikeCount] = useState(item.like)
  const [dislikeCount, setDislikeCount] = useState(item.dislike)
  const [attitude, setAttitude] = useState<Attitude>()

  const like = () => {
    setAttitude(1)
    setLikeCount(likeCount + 1)
    // TODO ajax
  }

  const dislike = () => {
    setDislikeCount(dislikeCount + 1)
    setAttitude(0)
    // TODO ajax
  }

  return (
    <View style={styles.actionContainer}>
      <Pressable
        onPress={like}
        style={[
          styles.action,
          attitude === 1
            ? { backgroundColor: global.colors.primaryColor }
            : undefined,
        ]}>
        <Icons
          iconText="&#xe611;"
          color={attitude === 1 ? '#fff' : undefined}
        />
        <Text
          style={{
            color: attitude === 1 ? '#fff' : undefined,
            marginLeft: 4,
          }}>
          {likeCount}
        </Text>
      </Pressable>
      <Pressable
        onPress={dislike}
        style={[
          styles.action,
          attitude === 0
            ? { backgroundColor: global.colors.error_color }
            : undefined,
        ]}>
        <Icons
          iconText="&#xe606;"
          color={attitude === 0 ? '#fff' : undefined}
        />
        <Text
          style={{
            color: attitude === 0 ? '#fff' : undefined,
            marginLeft: 4,
          }}>
          {dislikeCount}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  action: {
    backgroundColor: global.colors.shallowBoxBackgroundColor,
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 5,
  },
})

export default JudgeComponent
