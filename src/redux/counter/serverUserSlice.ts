import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  CachedUser,
  ServerUserInfo,
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
import DatabaseManager from '../../sqlite'
import AppEvents from '../../AppEvents'
import { persistor, resetReduxAction, store } from '../store'
import SqliteStorage from '../persist'
import { SERVER_USER_PERSIST_KEY } from './index'

const logger = getLogger('redux/counter/serverUserSlice')

const initialState: ServerUserState = {
  authenticated: false,
  cachedUser: {},
}

export const markLogin = createAsyncThunk<
  void,
  ServerUserInfo & { token: string }
>('/serverUserSlice/markLogin', async (arg, { dispatch }) => {
  // 加载用户数据库
  await DatabaseManager.loadDatabase(arg.uid)
  AppEvents.subscribeOnce('beforeDatabaseInitDone', () => {
    persistor.pause()
    store.dispatch(resetReduxAction())
    persistor.persist()
    SqliteStorage.subscribe(SERVER_USER_PERSIST_KEY, () => {
      dispatch(serverUserSlice.actions.markLogin(arg))
      dispatch(serverUserSlice.actions.modifyRequestToken(arg.token))
    })
  })
})

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
    logger.debug('local user length: ' + info.length)
    console.log(info)
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
    logger.debug('unresolved array: ' + unresolved)
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
    updateServerUserInfo(state, { payload }) {
      Object.assign(state.userInfo, payload)
    },
    combineUserCache(state, { payload }) {
      Object.assign(state.cachedUser, payload)
    },
    markLoginInvalid(state) {
      state.authenticated = false
      state.userInfo = undefined
      state.token = undefined
      AppEvents.trigger('onLogout')
    },
    modifyRequestToken(state, { payload }) {
      state.token = payload
      global.token = payload
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

AppEvents.subscribe('onLogout', () => {
  setTimeout(() => {
    DatabaseManager.closeConnection()
      .then(() => {
        persistor.pause()
        store.dispatch(resetReduxAction())
        DatabaseManager.setLastOpenUid(undefined)
        persistor.persist()
      })
      .catch(e => {
        logger.error('close database connection failed: ' + e.message)
      })
  }, 200)
})

export const {
  saveUserToCache,
  markLoginInvalid,
  updateServerUserInfo,
  modifyRequestToken,
} = serverUserSlice.actions

export default serverUserSlice.reducer
