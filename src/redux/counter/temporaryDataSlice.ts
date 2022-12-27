import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  TemporaryDataReducers,
  TemporaryDataState,
} from '../types/temporaryDataTypes'
import { innerCombineObject } from '../../utils/ObjectUtils'
import { CommunityTipQueryType } from '../../api/server/community'
import MessageTipMapper, { MessageTipTable } from '../../sqlite/message_tip'
import { getLogger } from '../../utils/LoggerUtils'
import AppEvents from '../../AppEvents'
import storeDispatch from '../storeDispatch'

const logger = getLogger('/redux/counter/temporaryDataSlice')

const initialState: TemporaryDataState = {
  isCheckLoginDone: false,
  globalStates: {},
  messageTips: [],
  messageTipCount: 0,
}

async function adjustUnreadMessage() {
  logger.info('adjusting unread message...')
  const tips = await MessageTipMapper.selectUnreadTip()
  let count = 0
  for (let i = 0; i < tips.length; i++) {
    count += tips[i].count
  }
  storeDispatch(
    modifyKVData({
      messageTipCount: count,
      messageTips: tips,
    })
  )
  logger.info(`adjust success, total ${count} unread messages`)
}

AppEvents.subscribe('onDatabaseInitDone', async () => {
  await adjustUnreadMessage()
})

/**
 * 保存消息提醒
 */
export const saveMessageTip = createAsyncThunk<void, CommunityTipQueryType[]>(
  '/temporaryData/saveMessageTip',
  async arg => {
    if (arg.length === 0) {
      return
    }

    const messageArr: Array<MessageTipTable> = []
    for (let value of arg) {
      messageArr.push({
        count: value.count,
        message_id: value.messageId,
        last_reply_time: value.lastReplyTime,
        last_reply_uid: value.lastReplyUid,
        last_reply_nickname: value.nickname,
        content: value.lastReplyContent,
        title: value.messageTitle,
        type: value.type,
      })
    }
    logger.info('saving data to database')
    await MessageTipMapper.insertMultiTip(messageArr)
    await MessageTipMapper.insertMultiTip(messageArr, 'unread_message_tip')
    await adjustUnreadMessage()
  }
)

const temporaryDataSlice = createSlice<
  TemporaryDataState,
  TemporaryDataReducers
>({
  name: 'temporaryData',
  reducers: {
    markCheckLoginDone(state) {
      state.isCheckLoginDone = true
    },
    saveGlobalState(state, { payload }) {
      if (typeof payload === 'object') {
        state.globalStates = innerCombineObject(state.globalStates, payload)
      } else {
        state.globalStates = Object.assign(state.globalStates, payload)
      }
    },
    modifyKVData(state, { payload }) {
      Object.assign(state, payload)
    },
  },
  initialState,
  extraReducers: {
    [saveMessageTip.rejected.type](state, { error }) {
      logger.error('save message tip failed: ' + error.message)
    },
  },
})

export const { markCheckLoginDone, saveGlobalState, modifyKVData } =
  temporaryDataSlice.actions

export default temporaryDataSlice.reducer
