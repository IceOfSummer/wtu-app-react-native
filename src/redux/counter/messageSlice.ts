/**
 * 有待重构，乱的一批 (
 * @date 2022-11-13 16:48
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  MessageLabel,
  MessageReducers,
  MessageState,
} from '../types/messageTypes'
import {
  insertMessage,
  insertMultiplyMessage,
  MessageType,
  SqliteMessage,
} from '../../sqlite/message'
import {
  deleteLastMessage,
  insertLastMessage,
  insertMultiLastMessage,
  markAllMessageRead,
  queryLastMessage,
} from '../../sqlite/last_message'
import { getLogger } from '../../utils/LoggerUtils'
import { showSingleBtnTip } from '../../native/modules/NativeDialog'
import { loadMultiUserCache, loadUserCacheFromServer } from './serverUserSlice'
import { ReducerTypes } from './index'
import { MultiChatResponseMessage } from '../../api/chat/message/response/MultiChatResponseMessage'
import { ImService } from '../../api/chat/ImService'
import {
  markMessageRead as markSqliteMessageRead,
  markMessageUnread as markSqliteMessageUnread,
} from '../../sqlite/last_message'
import AppEvents from '../../AppEvents'
import storeDispatch from '../storeDispatch'

const logger = getLogger('/redux/counter/messageSlice')

const REPLACE_TYPE_MARKER = /§\d*§/g

AppEvents.subscribe('onUserChange', arg => {
  console.log(arg)
  storeDispatch(initMessage())
})

type InitMessageResult = {
  label: MessageLabel
  count: number
}

/**
 * 初始化消息
 */
export const initMessage = createAsyncThunk<InitMessageResult, undefined>(
  'message/loadMessage',
  async (arg, { dispatch }) => {
    // 加载一下类
    ImService.INSTANCE
    // 加载聊天面板上的最后聊天记录
    logger.info('querying last message')
    const lastMsg = await queryLastMessage()
    let count = 0
    let messageLabels: MessageLabel = {}
    lastMsg.forEach(value => {
      value.content = value.content.replace(REPLACE_TYPE_MARKER, '')
      messageLabels[value.uid] = value
      count += value.unreadCount
    })
    // 加载相关用户
    dispatch(loadMultiUserCache(lastMsg.map(value => value.uid)))
    return {
      label: messageLabels,
      count,
    }
  }
)

export type InsertSingleMessageParam = {
  /**
   * 和谁相关的消息
   */
  msg: SqliteMessage
  unread: 0 | 1
}

/**
 * 插入单条消息
 */
export const insertSingleMessage = createAsyncThunk<
  void,
  InsertSingleMessageParam
>(
  'message/insertSingleMessage',
  async ({ msg, unread }, { dispatch, getState }) => {
    const re = await insertMessage(msg)
    logger.info('insert message to database success: ' + re)
    await insertLastMessage(msg, unread)
    logger.info('insert last message success!')
    const state = getState() as ReducerTypes
    if (!state.serverUser.cachedUser[msg.uid]) {
      // 拉取用户信息
      dispatch(loadUserCacheFromServer([msg.uid]))
    }
    dispatch(messageSlice.actions.insertOnlineMessage(msg))
    dispatch(
      messageSlice.actions.insertSingleMessage({
        ...msg,
        unreadCount: unread,
      })
    )
  }
)

type SyncMessageParam = {
  /**
   * 是否将这些消息标记为已读
   */
  confirmed: 0 | 1
  messages: MultiChatResponseMessage
}

/**
 * 同步多组消息
 */
export const syncMessage = createAsyncThunk<void, SyncMessageParam>(
  'message/insertMultiplyMessage',
  async ({ confirmed, messages }, { dispatch }) => {
    logger.info('syncing message: ')
    const msgArr = messages.messages
    const msg: SqliteMessage[] = msgArr.map(_arg => ({
      messageId: _arg.msgId,
      content: _arg.content,
      type: _arg.type ? _arg.type : MessageType.RECEIVE,
      uid: _arg.from,
      createTime: _arg.createTime,
    }))
    msg.sort((a, b) => a.messageId - b.messageId)
    // 保存到数据库
    await insertMultiplyMessage(msg)
    logger.info('insert multiply message success')
    await insertMultiLastMessage(msg)
    logger.info('insert last message success')
    // 移除type marker
    msg.forEach(value => {
      value.content = value.content.replace(REPLACE_TYPE_MARKER, '')
    })
    // 保存到新消息中
    if (confirmed) {
      dispatch(messageSlice.actions.insertOnlineMessage(msg))
    } else {
      dispatch(messageSlice.actions.insertOfflineMessage(msg))
    }
  }
)

/**
 * 移除消息面板上的消息
 */
export const removeMessagePanel = createAsyncThunk<void, number>(
  'message/removeMessagePanel',
  async (uid, { dispatch }) => {
    // 数据库记录删除
    await deleteLastMessage(uid)
    dispatch(messageSlice.actions.removeMessagePanel(uid))
  }
)

/**
 * 标记某条消息为已读状态
 */
export const markMessageRead = createAsyncThunk<void, number>(
  'message/markMessageRead',
  async (uid, { dispatch }) => {
    await markSqliteMessageRead(uid)
    dispatch(
      messageSlice.actions.modifyReadStatus({
        uid,
        confirmed: 1,
      })
    )
  }
)

/**
 * 标记某条消息为未读状态
 */
export const markMessageUnread = createAsyncThunk<void, number>(
  'message/markMessageUnread',
  async (uid, { dispatch }) => {
    await markSqliteMessageUnread(uid)
    dispatch(
      messageSlice.actions.modifyReadStatus({
        uid,
        confirmed: 0,
      })
    )
  }
)

/**
 * 标记消息列表上所有消息均已读
 */
export const markMessageAllRead = createAsyncThunk<void>(
  'message/markMessageAllRead',
  async (arg, { dispatch }) => {
    await markAllMessageRead()
    dispatch(messageSlice.actions.markAllRead())
  }
)

const messageSlice = createSlice<MessageState, MessageReducers>({
  name: 'message',
  initialState: {
    messageLabels: [],
    onlineMessages: [],
    unreadCount: 0,
  },
  reducers: {
    /**
     * do not export it, it needs extra operation, see {@link insertSingleMessage}
     */
    insertSingleMessage: (state, { payload }) => {
      state.unreadCount++
      // payload 不能直接修改
      state.messageLabels[payload.uid] = {
        ...payload,
        content: payload.content.replace(REPLACE_TYPE_MARKER, ''),
      }
    },
    /**
     * do not export it, it needs extra operation, see {@link removeMessagePanel}
     */
    removeMessagePanel: (state, { payload }) => {
      state.unreadCount -= state.messageLabels[payload]?.unreadCount ?? 0
      state.messageLabels[payload] = undefined
    },
    insertOnlineMessage: (state, { payload }) => {
      if (Array.isArray(payload)) {
        state.onlineMessages = state.onlineMessages.concat(payload)
        payload.forEach(value => {
          const previous = state.messageLabels[value.uid]?.unreadCount ?? 0
          state.messageLabels[value.uid] = {
            ...value,
            unreadCount: previous + 1,
          }
        })
        logger.debug('updating onlineMessages: ')
        logger.debug(state.onlineMessages)
      } else {
        const previous = state.messageLabels[payload.uid]?.unreadCount ?? 0
        state.messageLabels[payload.uid] = {
          ...payload,
          unreadCount: previous + 1,
        }
        state.onlineMessages.push(payload)
      }
    },
    resetCurrentTalkMessage: state => {
      state.onlineMessages = []
    },
    insertOfflineMessage: (state, { payload }) => {
      payload.forEach(value => {
        state.unreadCount++
        let base = state.messageLabels[value.uid]?.unreadCount ?? 0
        state.messageLabels[value.uid] = {
          ...value,
          unreadCount: base + 1,
        }
      })
    },
    modifyReadStatus: (state, { payload }) => {
      const target = state.messageLabels[payload.uid]
      if (target) {
        if (payload.confirmed) {
          // 标记为已读
          logger.info('modify read status: ' + target)
          state.unreadCount -= target.unreadCount
          target.unreadCount = 0
        } else {
          // 标记为未读
          state.unreadCount++
          target.unreadCount = 1
        }
      }
    },
    markAllRead: state => {
      state.unreadCount = 0
      Object.keys(state.messageLabels).forEach(key => {
        const l = state.messageLabels[Number.parseInt(key, 10)]
        if (l) {
          l.unreadCount = 0
        }
      })
    },
  },
  extraReducers: {
    [initMessage.fulfilled.type](
      state,
      { payload }: { payload: InitMessageResult }
    ) {
      logger.debug(
        `init message success, messageLabels count: ${
          Object.keys(payload).length
        }`
      )
      state.messageLabels = payload.label
      state.unreadCount = payload.count
    },
    [initMessage.rejected.type](state, { error }) {
      logger.error('while run "loadMessage" error, ' + error.message)
      showSingleBtnTip(
        '加载消息失败',
        '请寻求开发人员帮助或稍后再试:' + error.message
      )
    },
    [insertSingleMessage.rejected.type](state, { error }) {
      logger.error('while run "insertSingleMessage" error, ' + error.message)
    },
    [removeMessagePanel.rejected.type](state, { error }) {
      logger.error('while run "removeMessagePanel" error, ' + error.message)
    },
    [syncMessage.rejected.type](state, { error }) {
      logger.error('sync message failed: ' + error.message)
      showSingleBtnTip(
        '消息保存失败!',
        '这可能是很严重的BUG，为了您的使用体验，建议立刻导出日志并反馈给我们'
      )
    },
    [markMessageRead.rejected.type](state, { error }) {
      logger.error('mark message read failed: ' + error.message)
    },
    [markMessageUnread.rejected.type](state, { error }) {
      logger.error('mark message unread failed: ' + error.message)
    },
    [markMessageAllRead.rejected.type](state, { error }) {
      logger.error('mark message all read failed: ' + error.message)
    },
  },
})

export const { resetCurrentTalkMessage } = messageSlice.actions

export default messageSlice.reducer
