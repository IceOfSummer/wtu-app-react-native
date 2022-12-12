import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  CommunityMessageQueryType,
  feedbackMessage,
} from '../../../../api/server/community'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Icons from '../../../../component/Icons'
import Toast from 'react-native-root-toast'
import { MsgInfoContext } from '../../index'

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
  const { messageAttitude } = useContext(MsgInfoContext)
  const [attitude, setAttitude] = useState<Attitude>(() =>
    messageAttitude.get(item.id)
  )
  const loading = useRef(false)
  useEffect(() => {
    const att = messageAttitude.get(item.id)
    if (att !== undefined) {
      if (att) {
        setLikeCount(likeCount + 1)
      } else {
        setDislikeCount(dislikeCount + 1)
      }
    }
  }, [])

  const like = () => {
    if (loading.current) {
      return
    }
    loading.current = true
    if (attitude === 1) {
      // 取消点赞
      setAttitude(undefined)
      setLikeCount(likeCount - 1)
      feedbackMessage(item.id, undefined)
        .then(() => {
          Toast.show('取消点赞〒▽〒')
          messageAttitude.delete(item.id)
        })
        .catch(e => {
          Toast.show('取消点赞失败: ' + e.message)
        })
        .finally(() => {
          loading.current = false
        })
      return
    }
    if (attitude === 0) {
      setDislikeCount(dislikeCount - 1)
    }
    setAttitude(1)
    setLikeCount(likeCount + 1)
    feedbackMessage(item.id, 1)
      .then(() => {
        Toast.show('点赞成功(╯ε╰)')
        messageAttitude.set(item.id, 1)
      })
      .catch(e => {
        Toast.show('点赞失败: ' + e.message)
      })
      .finally(() => {
        loading.current = false
      })
  }

  const dislike = () => {
    if (loading.current) {
      return
    }
    messageAttitude.set(item.id, 0)
    loading.current = true
    if (attitude === 0) {
      // 取消踩
      setDislikeCount(dislikeCount - 1)
      setAttitude(undefined)
      feedbackMessage(item.id, undefined)
        .then(() => {
          Toast.show('取消踩(*/ω＼*)')
          messageAttitude.delete(item.id)
        })
        .catch(e => {
          Toast.show('评价失败: ' + e.message)
        })
        .finally(() => {
          loading.current = false
        })
      return
    }
    if (attitude === 1) {
      setLikeCount(likeCount - 1)
    }
    setDislikeCount(dislikeCount + 1)
    setAttitude(0)
    feedbackMessage(item.id, 0)
      .then(() => {
        Toast.show('不喜欢|_・)')
        messageAttitude.set(item.id, 0)
      })
      .catch(e => {
        Toast.show('评价失败: ' + e.message)
      })
      .finally(() => {
        loading.current = false
      })
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
