import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  BaseMessageRecord,
  MessageRecord,
  MessageReducers,
  MessageState,
} from '../types/messageTypes'
import {
  ChatMessage,
  insertMessage,
  ParamMessage,
  queryMessage,
} from '../../sqlite/message'
import { insertLastMessage, queryLastMessage } from '../../sqlite/last_message'
import { getLogger } from '../../utils/LoggerUtils'

const logger = getLogger('/redux/counter/messageSlice')

/**
 * 初始化消息
 */
export const initMessage = createAsyncThunk<BaseMessageRecord, number>(
  'message/loadMessage',
  async (uid: number) => {
    // 加载全部聊天记录
    const msg = await queryMessage(uid)
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
    const lastMsg = await queryLastMessage(uid)
    return {
      messageLabels: lastMsg,
      messages: messages,
    }
  }
)

/**
 * 插入单条消息
 */
export const insertSingleMessage = createAsyncThunk<
  ChatMessage,
  { sender: number; msg: ParamMessage }
>(
  'message/insertSingleMessage',
  async ({ msg, sender }: { sender: number; msg: ParamMessage }) => {
    const re = await insertMessage(sender, msg)
    await insertLastMessage(sender, 1, re)
    return re
  }
)

const messageSlice = createSlice<MessageState, MessageReducers>({
  name: 'message',
  initialState: {
    messageLabels: [],
    messages: {},
  },
  reducers: {},
  extraReducers: {
    [initMessage.fulfilled.type](
      state,
      { payload }: { payload: BaseMessageRecord }
    ) {
      logger.debug('init message success')
      state.messageLabels = []
      state.messages = payload.messages
    },
    [initMessage.rejected.type](state, { error }) {
      logger.error('while run "loadMessage" error, ' + error.message)
    },
    [insertSingleMessage.fulfilled.type](
      state,
      { payload }: { payload: ChatMessage }
    ) {
      const tar = state.messages[payload.sendTo]
      // 更新redux消息记录
      if (tar) {
        tar.push(payload)
      } else {
        state.messages[payload.sendTo] = [payload]
      }
      // 暴搜
      let i = 0,
        len = state.messageLabels.length
      for (; i < len; i++) {
        if (state.messageLabels[i].sendTo === payload.sendTo) {
          break
        }
      }
      if (i === len) {
        // 新聊天
        state.messageLabels.push(payload)
      } else {
        // 更新
        state.messageLabels[i] = payload
      }
    },
  },
})

export default messageSlice.reducer
