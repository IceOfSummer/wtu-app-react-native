import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  MessageLabel,
  MessageReducers,
  MessageState,
} from '../types/messageTypes'
import { insertMessage, SqliteMessage } from '../../sqlite/message'
import {
  deleteLastMessage,
  insertLastMessage,
  queryLastMessage,
} from '../../sqlite/last_message'
import { getLogger } from '../../utils/LoggerUtils'
import { quickShowErrorTip } from '../../native/modules/NativeDialog'
import { loadMultiUserCache, loadUserCacheFromServer } from './serverUserSlice'
import { ReducerTypes } from './index'

const logger = getLogger('/redux/counter/messageSlice')

const REPLACE_TYPE_MARKER = /§\d*§/g

/**
 * 初始化消息
 */
export const initMessage = createAsyncThunk<MessageState, undefined>(
  'message/loadMessage',
  async (arg, { dispatch }) => {
    // 加载聊天面板上的最后聊天记录
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
      currentTalkMessages: [],
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
    logger.debug('insert message to database success: ' + re)
    await insertLastMessage(msg, confirm)
    const state = getState() as ReducerTypes
    if (!state.serverUser.cachedUser[msg.uid]) {
      // 拉取用户信息
      dispatch(loadUserCacheFromServer([msg.uid]))
    }
    dispatch(messageSlice.actions.insertCurrentTalkMessage(msg))
    dispatch(messageSlice.actions.insertSingleMessage(msg))
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

const messageSlice = createSlice<MessageState, MessageReducers>({
  name: 'message',
  initialState: {
    messageLabels: [],
    currentTalkMessages: [],
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
    insertCurrentTalkMessage: (state, { payload }) => {
      state.currentTalkMessages.push(payload)
    },
    resetCurrentTalkMessage: state => {
      state.currentTalkMessages = []
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
  },
})

export const { resetCurrentTalkMessage } = messageSlice.actions

export default messageSlice.reducer
