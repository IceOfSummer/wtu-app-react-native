import { AjaxResponseTypes } from 'axios-simple-wrapper/lib/common/betterAjax'
import { ResponseTemplate } from './server/types'
import { cancelOldAjax, noRepeatAjax } from 'axios-simple-wrapper'
import serverConfig from './serverConfig'
import { AxiosResponse } from 'axios'
import { isAuthPage } from '../utils/AuthUtils'
import Toast from 'react-native-toast-message'
import { SCHOOL_AUTH } from '../router'
import { store } from '../redux/store'
import { markLoginExpired } from '../redux/actions/user'

const serverResponseInterceptor = (resp: AxiosResponse): any => {
  if (resp.data.code === undefined) {
    throw new Error(resp.data)
  }
  if (resp.data.code !== 0) {
    throw new Error(resp.data.message)
  }
  return resp.data
}

/**
 * 发送给跳蚤市场服务器的ajax
 */
export const serverNoRepeatAjax = <T>(
  url: string,
  data?: Record<string, any>,
  method?: 'GET' | 'POST'
): AjaxResponseTypes<ResponseTemplate<T>, true> =>
  new Promise((resolve, reject) => {
    noRepeatAjax<AxiosResponse<ResponseTemplate<T>>, true>(
      serverConfig.serverBaseUrl + url,
      data,
      method
    )
      .then(resp => resolve(serverResponseInterceptor(resp)))
      .catch(reject)
  })

/**
 * 发送给跳蚤市场服务器的ajax
 */
export const serverCancelOldAjax = <T>(
  url: string,
  data?: Record<string, any>,
  method?: 'GET' | 'POST'
): AjaxResponseTypes<ResponseTemplate<T>, true> =>
  new Promise((resolve, reject) => {
    cancelOldAjax<AxiosResponse<ResponseTemplate<T>>, true>(
      serverConfig.serverBaseUrl + url,
      data,
      method
    )
      .then(resp => resolve(serverResponseInterceptor(resp)))
      .catch(reject)
  })
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
