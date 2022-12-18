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

const initialState: ServerUserState = {
  authenticated: false,
  cachedUser: {},
}

/**
 * 加载多个用户的信息缓存
 */
export const loadMultiUserCache = createAsyncThunk<CachedUser, number[]>(
  'serverUser/loadMultiUserCache',
  async (arg, { dispatch }) => {
    logger.info('trying to load user: ' + arg)
    arg.sort((a, b) => a - b)
    const unresolved: number[] = []
    // 先从本地数拿
    const info = await loadMultiUserInfo(arg)
    const cachedUser: CachedUser = {}
    // 检查哪些数据本地没有, **此处arg和info#uid都是递增的，且arg的长度大于等于info**
    let infoPointer = 0
    let argCheckPointer = 0
    for (
      let len = arg.length, infoLen = info.length;
      argCheckPointer < len && infoPointer < infoLen;
      argCheckPointer++
    ) {
      const userInfo = info[infoPointer]
      if (userInfo.userId === arg[argCheckPointer]) {
        cachedUser[arg[argCheckPointer]] = userInfo
        infoPointer++
        continue
      }
      // 没有
      unresolved.push(arg[argCheckPointer])
    }
    // 后面半截
    for (let len = arg.length; argCheckPointer < len; argCheckPointer++) {
      unresolved.push(arg[argCheckPointer])
    }
    if (unresolved.length) {
      // 从服务器拿
      dispatch(loadUserCacheFromServer(unresolved))
    }
    return cachedUser
  }
)

export const loadUserCacheFromServer = createAsyncThunk<CachedUser, number[]>(
  'serverUser/loadUserCacheFromServer',
  async arg => {
    logger.info('loading user ' + arg + ' from server...')
    const info = await getMultiUserInfo(arg)
    logger.debug(info)
    const cachedUser: CachedUser = {}
    info.data.forEach(value => {
      cachedUser[value.userId] = value
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
      logger.info('saving user: ')
      logger.info(payload)
      state.cachedUser[payload.userId] = payload
      // FIXME 该操作应该提到外面
      // 保存到数据库
      insertOrUpdateUser(payload).catch(e => {
        logger.error('saving user failed: ' + e.message)
      })
    },
    combineUserCache(state, { payload }) {
      Object.assign(state.cachedUser, payload)
    },
    markLoginInvalid(state) {
      state.authenticated = false
      state.userInfo = undefined
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

export const { markLogin, saveUserToCache, markLoginInvalid } =
  serverUserSlice.actions

export default serverUserSlice.reducer
