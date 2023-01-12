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
  queryLastMessage,
} from '../../sqlite/last_message'
import { getLogger } from '../../utils/LoggerUtils'
import {
  quickShowErrorTip,
  showSingleBtnTip,
} from '../../native/modules/NativeDialog'
import { loadMultiUserCache, loadUserCacheFromServer } from './serverUserSlice'
import { ReducerTypes } from './index'
import { MultiChatResponseMessage } from '../../api/chat/message/response/MultiChatResponseMessage'
import ImTemplate from '../../api/chat/ImTemplate'
import { ImService } from '../../api/chat/ImService'
import { markMessageRead as markSqliteMessageRead } from '../../sqlite/last_message'
import AppEvents from '../../AppEvents'
import storeDispatch from '../storeDispatch'

const logger = getLogger('/redux/counter/messageSlice')

const REPLACE_TYPE_MARKER = /§\d*§/g

AppEvents.subscribe('onDatabaseInitDone', () => {
  storeDispatch(initMessage())
})

/**
 * 初始化消息
 */
export const initMessage = createAsyncThunk<MessageState, undefined>(
  'message/loadMessage',
  async (arg, { dispatch }) => {
    // 加载一下类
    ImTemplate.instance.isReady()
    ImService.INSTANCE
    // 加载聊天面板上的最后聊天记录
    logger.info('querying last message')
    const lastMsg = await queryLastMessage()
    let messageLabels: MessageLabel = {}
    lastMsg.forEach(value => {
      value.content = value.content.replace(REPLACE_TYPE_MARKER, '')
      messageLabels[value.uid] = value
    })
    // 加载相关用户
    dispatch(loadMultiUserCache(lastMsg.map(value => value.uid)))
    return {
      messageLabels,
      onlineMessages: [],
    }
  }
)

export type InsertSingleMessageParam = {
  /**
   * 和谁相关的消息
   */
  msg: SqliteMessage
  confirm: 0 | 1
}

/**
 * 插入单条消息
 */
export const insertSingleMessage = createAsyncThunk<
  void,
  InsertSingleMessageParam
>(
  'message/insertSingleMessage',
  async ({ msg, confirm }, { dispatch, getState }) => {
    const re = await insertMessage(msg)
    logger.info('insert message to database success: ' + re)
    await insertLastMessage(msg, confirm)
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
        confirmed: confirm,
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
    await insertMultiLastMessage(msg, 0)
    logger.info('insert last message success')
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

const messageSlice = createSlice<MessageState, MessageReducers>({
  name: 'message',
  initialState: {
    messageLabels: [],
    onlineMessages: [],
  },
  reducers: {
    /**
     * do not export it, it needs extra operation, see {@link insertSingleMessage}
     */
    insertSingleMessage: (state, { payload }) => {
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
      state.messageLabels[payload] = undefined
    },
    insertOnlineMessage: (state, { payload }) => {
      if (Array.isArray(payload)) {
        state.onlineMessages = state.onlineMessages.concat(payload)
        payload.forEach(value => {
          state.messageLabels[value.uid] = {
            ...value,
            confirmed: 1,
          }
        })
        logger.debug('updating onlineMessages: ')
        logger.debug(state.onlineMessages)
      } else {
        state.messageLabels[payload.uid] = {
          ...payload,
          confirmed: 1,
        }
        state.onlineMessages.push(payload)
      }
    },
    resetCurrentTalkMessage: state => {
      state.onlineMessages = []
    },
    setUnread: (state, { payload }) => {
      payload.forEach(value => {
        const target = state.messageLabels[value.messageId]
        if (target) {
          target.confirmed = 0
        } else {
          state.messageLabels[value.messageId] = {
            ...value,
            confirmed: 0,
          }
        }
      })
    },
    insertOfflineMessage: (state, { payload }) => {
      payload.forEach(value => {
        state.messageLabels[value.uid] = {
          ...value,
          confirmed: 0,
        }
      })
    },
    modifyReadStatus: (state, { payload }) => {
      const target = state.messageLabels[payload.uid]
      if (target) {
        target.confirmed = payload.confirmed
      }
    },
  },
  extraReducers: {
    [initMessage.fulfilled.type](
      state,
      { payload }: { payload: MessageState }
    ) {
      logger.debug(
        `init message success, messageLabels count: ${
          Object.keys(payload.messageLabels).length
        }`
      )
      state.messageLabels = payload.messageLabels
    },
    [initMessage.rejected.type](state, { error }) {
      logger.error('while run "loadMessage" error, ' + error.message)
      quickShowErrorTip(
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
  },
})

export const { resetCurrentTalkMessage } = messageSlice.actions

export default messageSlice.reducer
