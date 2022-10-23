import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  CachedUser,
  ServerUserReducers,
  ServerUserState,
} from '../types/serverUserTypes'
import {
  insertOrUpdateMultiUsers,
  insertOrUpdateUser,
  loadMultiUserInfo,
} from '../../sqlite/user'
import { getLogger } from '../../utils/LoggerUtils'
import { getMultiUserInfo } from '../../api/server/user'

const logger = getLogger('redux/counter/serverUserSlice')

const initialState: ServerUserState = __DEV__
  ? {
      authenticated: true,
      userInfo: {
        uid: 1,
        username: '123456',
        nickname: '123456',
      },
      cachedUser: {},
    }
  : {
      authenticated: false,
      cachedUser: {},
    }

/**
 * 加载多个用户的信息缓存
 */
export const loadMultiUserCache = createAsyncThunk<CachedUser, number[]>(
  'serverUser/loadMultiUserCache',
  async (arg, { dispatch }) => {
    arg.sort((a, b) => a - b)
    const unresolved: number[] = []
    // 先从本地数拿
    const info = await loadMultiUserInfo(arg)
    // 检查哪些数据本地没有, **此处arg和info#uid都是递增的，且arg的长度大于等于info**
    let infoPointer = 0
    let argCheckPointer = 0
    for (
      let len = arg.length, infoLen = info.length;
      argCheckPointer < len && infoPointer < infoLen;
      argCheckPointer++
    ) {
      if (info[infoPointer].uid === arg[argCheckPointer]) {
        infoPointer++
        continue
      }
      // 没有
      unresolved.push(arg[argCheckPointer])
    }
    // 后面半截
    for (let len = arg.length; argCheckPointer < len; argCheckPointer++) {
      unresolved.push(argCheckPointer)
    }
    if (unresolved.length) {
      // 从服务器拿
      dispatch(loadUserCacheFromServer(unresolved))
    }
    return info
  }
)

const loadUserCacheFromServer = createAsyncThunk<CachedUser, number[]>(
  'serverUser/loadUserCacheFromServer',
  async arg => {
    logger.info('loading user ' + arg + ' from server...')
    const info = await getMultiUserInfo(arg)
    const cachedUser: CachedUser = {}
    info.data.forEach(value => {
      cachedUser[value.uid] = value
    })
    // 存数据库
    insertOrUpdateMultiUsers(info.data).catch(e =>
      logger.error('save user to database fail, ' + e.message)
    )
    return cachedUser
  }
)

const serverUserSlice = createSlice<ServerUserState, ServerUserReducers>({
  name: 'serverUserSlice',
  initialState,
  reducers: {
    markLogin(state, { payload }) {
      state.authenticated = true
      state.userInfo = payload
    },
    saveUserToCache(state, { payload }) {
      const str = JSON.stringify(payload)
      logger.info('saving user: ' + str)
      state.cachedUser[payload.uid] = payload
      // 保存到数据库
      insertOrUpdateUser(payload).catch(e => {
        logger.error('saving user: ' + str + ' fail, ' + e.message)
      })
    },
    combineUserCache(state, { payload }) {
      Object.assign(state.cachedUser, payload)
    },
  },
  extraReducers: {
    [loadMultiUserCache.fulfilled.type](
      state,
      { payload }: { payload: CachedUser }
    ) {
      Object.assign(state.cachedUser, payload)
    },
    [loadMultiUserCache.rejected.type](state, { error }) {
      logger.error('loadMultiUserCache failed: ' + error.message)
    },
    [loadUserCacheFromServer.fulfilled.type](
      state,
      { payload }: { payload: CachedUser }
    ) {
      Object.assign(state.cachedUser, payload)
      logger.info('successfully loaded user from server')
    },
    [loadUserCacheFromServer.rejected.type](state, { error }) {
      logger.error('loadUserCacheFromServer failed: ' + error.message)
    },
  },
})

export const { markLogin, saveUserToCache } = serverUserSlice.actions

export default serverUserSlice.reducer
