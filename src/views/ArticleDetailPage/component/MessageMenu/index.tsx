import React from 'react'
import BottomMenu, { MenuItem } from '../../../../component/Drawer/BottomMenu'
import Drawer from '../../../../component/Drawer'
import { Comment } from '../CommentContainer'
import { deletePost } from '../../../../api/server/community'
import Toast from 'react-native-root-toast'
import { ArticleDetailContext } from '../../index'
import { getLogger } from '../../../../utils/LoggerUtils'
import Loading from '../../../../component/Loading'

const items: MenuItem[] = [{ name: '删除', icon: '&#xe645;' }]

const logger = getLogger('/views/ArticleDetailPage/component/MessageMenu')

interface MessageMenuProps {
  navigation: { goBack: () => void }
}

export default class MessageMenu extends React.Component<
  MessageMenuProps,
  any
> {
  drawer = React.createRef<Drawer>()

  comment?: Comment

  isRoot?: boolean

  onSelect = (index: number) => {
    this.drawer.current?.closeDrawer()
    const comment = this.comment!
    if (index === 0) {
      // delete
      logger.info('deleting comment id' + comment.id)
      Loading.showLoading()
      deletePost(comment.id)
        .then(() => {
          logger.info('delete success')
          Toast.show('删除成功!')
          this.updateComment()
        })
        .catch(e => {
          logger.error('delete failed: ' + e.message)
          Toast.show('删除失败: ' + e.message)
        })
        .finally(() => {
          Loading.hideLoading()
        })
    }
  }

  private updateComment() {
    logger.info('updating comments')
    if (this.isRoot) {
      logger.info('delete the root comment, go back directly')
      // go back
      setTimeout(() => {
        this.props.navigation.goBack()
      }, 200)
      return
    }
    const context = this.context as ArticleDetailContext
    const comment = this.comment!
    let index1 = -1
    for (let i = 0, len = context.comments.length; i < len; i++) {
      const com = context.comments[i]
      if (com.replyPreview) {
        const sub = com.replyPreview.findIndex(value => value.id === comment.id)
        if (sub >= 0) {
          // 移除评论预览
          com.replyPreview.splice(sub, 1)
        }
      }
      if (com.id === comment.id) {
        index1 = i
        break
      }
    }
    if (index1 >= 0) {
      logger.info('removing comment')
      context.comments.splice(index1, 1)
      context.setComments([...context.comments])
    }
    const index2 = context.subComments.findIndex(
      value => value.id === comment.id
    )
    if (index2 >= 0) {
      logger.info('removing sub comment')
      context.subComments.splice(index1, 1)
      context.setSubComments([...context.subComments])
    }
  }

  /**
   * @param comment 评论
   * @param isRoot 是否为根消息(删除后会直接退出)
   */
  public openMenu(comment: Comment, isRoot: boolean) {
    this.comment = comment
    this.isRoot = isRoot
    this.drawer.current?.showDrawer()
  }

  constructor(props: MessageMenuProps, context: any) {
    super(props, context)
  }

  render() {
    return (
      <Drawer ref={this.drawer}>
        <BottomMenu onSelect={this.onSelect} items={items} title="消息选项" />
      </Drawer>
    )
  }
}
