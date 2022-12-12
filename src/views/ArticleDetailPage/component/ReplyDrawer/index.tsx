import React from 'react'
import {
  CommunityMessageQueryType,
  postArticle,
} from '../../../../api/server/community'
import Drawer from '../../../../component/Drawer'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Avatar, { getAvatarUrl } from '../../../../component/Container/Avatar'
import Icons from '../../../../component/Icons'
import { getLogger } from '../../../../utils/LoggerUtils'
import Loading from '../../../../component/Loading'
import Toast from 'react-native-root-toast'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'

const logger = getLogger('/views/ArticleDetailPage/component/ReplyDrawer')

interface ReplyDrawerProps {
  onReplySend?: (article: CommunityMessageQueryType) => void
  placeholder?: string
  userInfo?: ServerUserInfo
}

interface ReplyDrawerState {
  reply: OpenDrawerParam
  replyText: string
}

type OpenDrawerParam = {
  pid: number
  replyTo: number
  message: string
  replyToUserId: number
}
export default class ReplyDrawer extends React.Component<
  ReplyDrawerProps,
  ReplyDrawerState
> {
  drawer = React.createRef<Drawer>()

  state: ReplyDrawerState = {
    reply: { pid: 0, message: '', replyTo: 0, replyToUserId: 0 },
    replyText: '',
  }

  public openReplyDrawer(param: OpenDrawerParam) {
    this.setState({ reply: param, replyText: '' }, () => {
      this.drawer.current?.showDrawer()
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
    logger.info('start submitting message...')
    logger.debug(param)
    Loading.showLoading()
    postArticle(param)
      .then(r => {
        const userInfo = this.props.userInfo
        if (!userInfo) {
          logger.warn('userinfo is null!')
          return
        }
        this.props.onReplySend?.({
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

  constructor(props: ReplyDrawerProps) {
    super(props)
    console.log(props)
    this.onChangeText = this.onChangeText.bind(this)
    this.submitReply = this.submitReply.bind(this)
  }

  render() {
    const { reply, replyText } = this.state
    return (
      <Drawer ref={this.drawer}>
        <View style={styles.container}>
          <View style={styles.replyPreviewContainer}>
            <Avatar uri={getAvatarUrl(reply.replyToUserId)} size={35} />
            <Text numberOfLines={1} style={styles.replyText}>
              {reply.message}
            </Text>
          </View>
          <View style={styles.replyContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                maxLength={499}
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
