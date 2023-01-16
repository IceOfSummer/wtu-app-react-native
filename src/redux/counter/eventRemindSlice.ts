import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  EventRemindReducers,
  EventRemindState,
} from '../types/eventRemindTypes'
import {
  EventRemindType,
  markAllRead,
  queryEventRemind,
} from '../../api/server/event_remind'
import EventRemindMapper from '../../sqlite/event_remind'
import { getLogger } from '../../utils/LoggerUtils'
import AppEvents from '../../AppEvents'
import storeDispatch from '../storeDispatch'

const logger = getLogger('/redux/counter/eventRemindSlice')

const initialState: EventRemindState = {
  sumUnreadCount: 0,
  likeMessageCount: 0,
  replyMessageCount: 0,
  systemMessageCount: 0,
  likeReminds: [],
  replyReminds: [],
  sysReminds: [],
}

AppEvents.subscribe('onUserChange', () => {
  storeDispatch(loadUnreadEventReminds())
})

export const loadUnreadEventReminds = createAsyncThunk<void>(
  '/eventRemind/loadUnreadEventReminds',
  async (arg, { dispatch }) => {
    const response = await queryEventRemind()
    if (response.data.length === 0) {
      return
    }
    await markAllRead()
    await EventRemindMapper.insertEventReminds(response.data)
    dispatch(eventRemindSlice.actions.saveUnreadReminds(response.data))
  }
)

const eventRemindSlice = createSlice<EventRemindState, EventRemindReducers>({
  name: 'eventRemind',
  initialState,
  reducers: {
    saveUnreadReminds: (state, { payload }) => {
      let count = 0
      let likeMessageCount = 0
      let replyMessageCount = 0
      // let systemMessageCount = 0
      payload.forEach(value => {
        count += value.count ?? 1
        if (
          value.sourceType === EventRemindType.REPLY_POST ||
          value.sourceType === EventRemindType.REPLY_SUB
        ) {
          state.replyReminds.push(value)
          replyMessageCount++
        } else if (
          value.sourceType === EventRemindType.LIKE_COMMENT ||
          value.sourceType === EventRemindType.LIKE_POST
        ) {
          state.likeReminds.push(value)
          likeMessageCount++
        }
      })
      state.replyMessageCount += replyMessageCount
      state.likeMessageCount += likeMessageCount
      state.sumUnreadCount += count
    },
    removeRemind: (state, { payload }) => {
      let arrKey: keyof EventRemindState
      let countKey: keyof EventRemindState
      switch (payload.type) {
        case EventRemindType.LIKE_POST:
        case EventRemindType.LIKE_COMMENT:
          arrKey = 'likeReminds'
          countKey = 'likeMessageCount'
          break
        case EventRemindType.REPLY_POST:
        case EventRemindType.REPLY_SUB:
          arrKey = 'replyReminds'
          countKey = 'replyMessageCount'
          break
        default:
          logger.error('unknown remind type: ' + payload.type)
          return
      }
      const index = state[arrKey].findIndex(value => value.id === payload.id)
      if (index === -1) {
        logger.warn('can not find remove target: ' + payload)
        return
      }
      state[countKey] -= state[arrKey][index].count ?? 1
      state[arrKey].splice(index, 1)
    },
    clearAllRemind: state => {
      state.likeReminds = []
      state.likeMessageCount = 0
      state.replyReminds = []
      state.replyMessageCount = 0
      state.sysReminds = []
      state.systemMessageCount = 0
    },
    clearReplyRemind: state => {
      state.sumUnreadCount -= state.replyMessageCount
      state.replyReminds = []
      state.replyMessageCount = 0
    },
    clearLikeRemind: state => {
      state.sumUnreadCount -= state.likeMessageCount
      state.likeReminds = []
      state.likeMessageCount = 0
    },
    clearSysMsgRemind: state => {
      state.sumUnreadCount -= state.systemMessageCount
      state.sysReminds = []
      state.systemMessageCount = 0
    },
  },
  extraReducers: {
    [loadUnreadEventReminds.rejected.type](state, { error }) {
      logger.error('load unread event reminds failed: ' + error.message)
    },
  },
})

export const { clearLikeRemind, clearReplyRemind } = eventRemindSlice.actions

export default eventRemindSlice.reducer
