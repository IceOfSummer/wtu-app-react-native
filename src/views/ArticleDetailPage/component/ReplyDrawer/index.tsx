import React from 'react'
import {
  CommunityMessageQueryType,
  postArticle,
} from '../../../../api/server/community'
import Drawer from '../../../../component/Drawer'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Avatar from '../../../../component/Container/Avatar'
import Icons from '../../../../component/Icons'
import { getLogger } from '../../../../utils/LoggerUtils'
import Loading from '../../../../component/Loading'
import Toast from 'react-native-root-toast'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'
import { ArticleDetailContext } from '../../index'

const logger = getLogger('/views/ArticleDetailPage/component/ReplyDrawer')

interface ReplyDrawerProps {
  placeholder?: string
  userInfo?: ServerUserInfo
}

interface ReplyDrawerState {
  reply: OpenDrawerParam
  replyText: string
}

export type OpenDrawerParam = {
  pid: number
  replyTo: number
  message: string
  replyToUserId: number
  // 是否为二级评论详细页面
  isSubReplyPage: boolean
}
export default class ReplyDrawer extends React.Component<
  ReplyDrawerProps,
  ReplyDrawerState
> {
  drawer = React.createRef<Drawer>()

  state: ReplyDrawerState = {
    reply: {
      pid: 0,
      message: '',
      replyTo: 0,
      replyToUserId: 0,
      isSubReplyPage: false,
    },
    replyText: '',
  }

  public openReplyDrawer(param: OpenDrawerParam) {
    this.setState({ reply: param, replyText: '' }, () => {
      this.drawer.current?.showDrawer()
      setTimeout(() => {
        this.textInput.current?.focus()
      }, 300)
    })
  }

  onChangeText = (text: string) => {
    this.setState({
      replyText: text,
    })
  }

  submitReply = () => {
    const param = {
      ...this.state.reply,
      content: this.state.replyText,
    }
    const uid = this.props.userInfo?.uid
    logger.info('sending reply...')
    logger.debug(param)
    Loading.showLoading()
    const contentPreview =
      param.content.length < 30
        ? param.content
        : param.content.substring(0, 31) + '...'
    postArticle(
      { ...param, contentPreview },
      uid !== undefined && uid !== this.state.reply.replyToUserId
    )
      .then(r => {
        const userInfo = this.props.userInfo
        logger.info('send reply success')
        if (!userInfo) {
          logger.warn('userinfo is null!')
          return
        }
        Toast.show('评论成功!')
        this.updateComment({
          author: userInfo.uid,
          content: param.content,
          createTime: Date.now(),
          dislike: 0,
          id: r.data,
          like: 0,
          nickname: userInfo.nickname,
          pid: param.pid,
          replyCount: 0,
          replyTo: param.replyTo,
          title: '',
          contentPreview,
        })
      })
      .catch(e => {
        logger.error('submit message failed: ' + e.message)
        logger.error(param)
        Toast.show('发布评论失败: ' + e.message)
      })
      .finally(() => {
        Loading.hideLoading()
        this.drawer.current?.closeDrawer()
      })
  }

  private updateComment(message: CommunityMessageQueryType) {
    logger.info('updating comment...')
    const context = this.context as ArticleDetailContext
    const parent = context.comments.find(value => value.id === message.pid)
    if (parent) {
      if (parent.replyPreview) {
        parent.replyPreview.push(message)
      } else {
        parent.replyPreview = [message]
      }
    }
    if (this.state.reply.isSubReplyPage) {
      context.setSubComments([message, ...context.subComments])
    } else if (!parent) {
      // 在主文章页面，直接评论根消息
      context.setComments([message, ...context.comments])
    } else {
      // 强制刷新
      context.setComments([...context.comments])
    }
  }

  textInput = React.createRef<TextInput>()

  constructor(props: ReplyDrawerProps, context: ArticleDetailContext) {
    super(props, context)
    this.onChangeText = this.onChangeText.bind(this)
    this.submitReply = this.submitReply.bind(this)
  }

  render() {
    const { reply, replyText } = this.state
    return (
      <Drawer ref={this.drawer}>
        <View style={styles.container}>
          <View style={styles.replyPreviewContainer}>
            <Avatar uid={reply.replyToUserId} size={35} />
            <Text numberOfLines={1} style={styles.replyText}>
              {reply.message}
            </Text>
          </View>
          <View style={styles.replyContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                maxLength={499}
                ref={this.textInput}
                style={styles.input}
                placeholder={this.props.placeholder ?? '留下你的评论'}
                onChangeText={this.onChangeText}
              />
            </View>
            {replyText.length ? (
              <Pressable style={styles.button} onPress={this.submitReply}>
                <Icons size={20} iconText="&#xec0b;" color="#fff" />
              </Pressable>
            ) : null}
          </View>
        </View>
      </Drawer>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 5,
  },
  inputContainer: {
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: global.colors.shallowBoxBackgroundColor,
    flex: 1,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: global.colors.primaryColor,
    borderRadius: 200,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  replyPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    padding: 15,
  },
  replyText: {
    fontSize: global.styles.$font_size_base,
    marginLeft: 4,
    width: '90%',
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: global.styles.$spacing_col_base,
  },
})
