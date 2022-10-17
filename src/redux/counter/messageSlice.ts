import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  MessageLabel,
  MessageRecord,
  MessageReducers,
  MessageState,
  RelatedUser,
} from '../types/messageTypes'
import { insertMessage, ParamMessage, queryMessage } from '../../sqlite/message'
import {
  deleteLastMessage,
  insertLastMessage,
  queryLastMessage,
} from '../../sqlite/last_message'
import { getLogger } from '../../utils/LoggerUtils'
import { quickShowErrorTip } from '../../native/modules/NativeDialog'
import { loadMultiUserInfo } from '../../sqlite/user'

const logger = getLogger('/redux/counter/messageSlice')

/**
 * 初始化消息
 */
export const initMessage = createAsyncThunk<MessageState, void>(
  'message/loadMessage',
  async () => {
    // 加载全部聊天记录
    const msg = await queryMessage()
    msg.sort((a, b) => a.sendTo - b.sendTo)

    const messages: MessageRecord = {}
    if (msg.length > 0) {
      messages[msg[0].sendTo] = [msg[0]]
      let last = msg[0].sendTo

      for (let i = 1, len = msg.length; i < len; i++) {
        if (msg[i].sendTo !== last) {
          last = msg[i].sendTo
        }
        messages[last]!.push(msg[i])
      }
    }
    // 加载聊天面板上的最后聊天记录
    const lastMsg = await queryLastMessage()
    let messageLabels: MessageLabel = {}
    lastMsg.forEach(value => {
      messageLabels[value.sendTo] = value
    })
    // 加载相关用户
    const info = await loadMultiUserInfo(lastMsg.map(value => value.sendTo))
    const relatedUser: RelatedUser = {}
    info.forEach(value => {
      relatedUser[value.uid] = value
    })
    return {
      messageLabels,
      messages,
      relatedUser,
    }
  }
)

export type InsertSingleMessageParam = {
  sender: number
  msg: ParamMessage
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
  async ({ msg, sender, confirm }, { dispatch }) => {
    // FIXME 插入失败后的处理方式
    const re = await insertMessage(sender, msg)
    logger.debug('insert message to database success: ' + re)
    await insertLastMessage(sender, confirm, re)
    dispatch(messageSlice.actions.insertSingleMessage(re))
  }
)

export const removeMessagePanel = createAsyncThunk<void, number>(
  'message/removeMessagePanel',
  async (username, { dispatch }) => {
    // 数据库记录删除
    await deleteLastMessage(username)
    dispatch(messageSlice.actions.removeMessagePanel(username))
  }
)

const messageSlice = createSlice<MessageState, MessageReducers>({
  name: 'message',
  initialState: {
    messageLabels: [],
    messages: {},
    relatedUser: {},
  },
  reducers: {
    /**
     * do not export it, it needs extra operation, see {@link insertSingleMessage}
     */
    insertSingleMessage: (state, { payload }) => {
      const tar = state.messages[payload.sendTo]
      // 更新redux消息记录
      if (tar) {
        tar.push(payload)
      } else {
        state.messages[payload.sendTo] = [payload]
      }
      state.messageLabels[payload.sendTo] = payload
    },
    /**
     * do not export it, it needs extra operation, see {@link removeMessagePanel}
     */
    removeMessagePanel: (state, { payload }) => {
      state.messageLabels[payload] = undefined
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
      state.messages = payload.messages
      state.relatedUser = payload.relatedUser
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

export default messageSlice.reducer
