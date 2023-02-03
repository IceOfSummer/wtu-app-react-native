import { AjaxResponseTypes } from 'axios-simple-wrapper/lib/common/betterAjax'
import { ResponseTemplate } from './server/types'
import wrapperStatic, {
  cancelOldAjax,
  noRepeatAjax,
} from 'axios-simple-wrapper'
import { AxiosResponse, AxiosError } from 'axios'
import { isAuthPage } from '../utils/AuthUtils'
import Toast from 'react-native-toast-message'
import { SCHOOL_AUTH, SERVER_AUTH_PAGE } from '../router'
import { store } from '../redux/store'
import {
  markLoginInvalid,
  modifyRequestToken,
} from '../redux/counter/serverUserSlice'
import { navigationPush } from '../tabs'
import Environment from '../utils/Environment'
import { getLogger } from '../utils/LoggerUtils'
import { RejectPolicy } from 'axios-simple-wrapper/lib/interceptor/debounce'
import { markLoginExpired } from '../redux/counter/wtuUserSlice'
import { toNativeErrorMessage } from './util'

const logger = getLogger('/api/request')

const serverResponseInterceptor = (resp: AxiosResponse): any => {
  if (resp.headers.Token) {
    store.dispatch(modifyRequestToken(resp.headers.Token))
  }
  if (resp.data.code === undefined) {
    logger.warn('the response code is undefined! response: ' + resp)
    throw new Error(resp.data)
  }
  if (resp.data.code !== 0) {
    logger.error(`request failed: ${resp.request._url}: ${resp.data.message}`)
    throw new Error(resp.data.message)
  }
  return resp.data
}

const serverRequestErrorInterceptor = (error: AxiosError): Error => {
  const data = error.response?.data as any
  if (data && data.message) {
    if (data.code === 1) {
      // 标记登录失效
      store.dispatch(markLoginInvalid())
      // 跳转登录页面
      navigationPush(SERVER_AUTH_PAGE)
    }
    return new Error(data.message)
  } else {
    error.message = toNativeErrorMessage(error)
    return error
  }
}

function createServerAjax(rejectPolicy: RejectPolicy) {
  return <T>(
    url: string,
    data?: Record<string, any>,
    method?: 'GET' | 'POST'
  ): AjaxResponseTypes<ResponseTemplate<T>, true> =>
    new Promise((resolve, reject) => {
      const fullUrl = Environment.serverBaseUrl + url
      logger.info(`${method ?? 'GET'}: ${fullUrl};`)
      wrapperStatic({
        url: fullUrl,
        method,
        param: data,
        rejectPolicy,
        axiosConfig: {
          headers: global.token
            ? {
                Authorization: global.token,
              }
            : undefined,
        },
      })
        .then(resp => resolve(serverResponseInterceptor(resp)))
        .catch(e => reject(serverRequestErrorInterceptor(e)))
    })
}

/**
 * 发送给跳蚤市场服务器的ajax
 */
export const serverNoRepeatAjax = createServerAjax('rejectIfExist')
/**
 * 发送给跳蚤市场服务器的ajax
 */
export const serverCancelOldAjax = createServerAjax('cancelOldTask')

// 当登录过期后, 不显示Toast
export const IGNORE_LOGIN_EXPIRE = 'ignoreLoginExpire;'
const IGNORE_LOGIN_EXPIRE_REGX = /#.*ignoreLoginExpire/
// 返回完整的响应信息
export const GET_FULL_RESPONSE = 'getFullResponse;'
const GET_FULL_RESPONSE_REGX = /#.*getFullResponse/

const wtuResponseInterceptor = (resp: AxiosResponse): any => {
  const requestUrl = resp.request._url as string
  // 检查url后是否带有 #ignoreLoginExpire 字段
  if (
    !IGNORE_LOGIN_EXPIRE_REGX.test(requestUrl) &&
    typeof resp.request.responseURL === 'string'
  ) {
    if (isAuthPage(resp.request.responseURL)) {
      // 登录失效
      Toast.show({
        text1: '登录过期',
        text2: '点击重新登录',
        type: 'NavToast',
        props: {
          routerName: SCHOOL_AUTH,
        },
      })
      store.dispatch(markLoginExpired())
      return Promise.reject('登录过期')
    }
  }
  if (GET_FULL_RESPONSE_REGX.test(requestUrl)) {
    return resp
  }
  if (resp.data) {
    return resp.data
  }
  return resp
}

export const wtuNoRepeatAjax = <T>(
  url: string,
  data?: Record<string, any>,
  method?: 'GET' | 'POST'
): AjaxResponseTypes<T, true> =>
  new Promise((resolve, reject) => {
    noRepeatAjax(url, data, method)
      .then(resp => resolve(wtuResponseInterceptor(resp)))
      .catch(reject)
  })

export const wtuCancelOldAjax = <T>(
  url: string,
  data?: Record<string, any>,
  method?: 'GET' | 'POST'
): AjaxResponseTypes<T, true> =>
  new Promise((resolve, reject) => {
    cancelOldAjax(url, data, method)
      .then(resp => resolve(wtuResponseInterceptor(resp)))
      .catch(reject)
  })
