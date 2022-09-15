import betterAjax, {
  applyDebounceInterceptor,
  cancelOldAjax,
  noRepeatAjax,
} from 'axios-simple-wrapper'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { SCHOOL_AUTH } from '../router'
import { store } from '../redux/store'
import { markLoginExpired } from '../redux/actions/user'
import { isAuthPage } from '../utils/AuthUtils'
import serverConfig from './serverConfig'
import { AxiosResponse } from 'axios'
import { AjaxResponseTypes } from 'axios-simple-wrapper/lib/common/betterAjax'
import { ResponseTemplate } from './server/types'

// 当登录过期后, 不显示Toast
export const IGNORE_LOGIN_EXPIRE = 'ignoreLoginExpire;'
const IGNORE_LOGIN_EXPIRE_REGX = /#.*ignoreLoginExpire/
// 返回完整的响应信息
export const GET_FULL_RESPONSE = 'getFullResponse;'
const GET_FULL_RESPONSE_REGX = /#.*getFullResponse/

betterAjax.default.axios = axios

function processWtuResponse(requestUrl: string, resp: AxiosResponse) {
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

function processServerResponse(resp: AxiosResponse) {
  return resp.data
}
// applyDebounceInterceptor(axios)
axios.interceptors.response.use(response => {
  //   if (__DEV__ && !response) {
  //     return response
  //   }
  //   // 强转一下，不然报错（
  //   const resp = response as AxiosResponse
  //   const requestUrl = resp.request._url as string
  //   if (requestUrl.startsWith(serverConfig.serverBaseUrl)) {
  //     return processServerResponse(resp)
  //   } else {
  //     console.log(requestUrl)
  //     return processWtuResponse(requestUrl, resp)
  //   }
  // },
  // error => {
  //   return error
  // }
  return response.data
})

// axios.interceptors.request.use(config => {
//   config.headers = {
//     ...config.headers,
//     'User-Agent':
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.39',
//   }
//   console.log(config)
//   return config
// })

/**
 * 发送给跳蚤市场服务器的ajax
 */
export const serverNoRepeatAjax = <T>(
  url: string,
  data: Record<string, any>,
  method: 'GET' | 'POST'
): AjaxResponseTypes<ResponseTemplate<T>, true> => {
  return noRepeatAjax<ResponseTemplate<T>, true>(
    serverConfig.serverBaseUrl + url,
    data,
    method
  )
}

/**
 * 发送给跳蚤市场服务器的ajax
 */
export const serverCancelOldAjax = <T>(
  url: string,
  data: Record<string, any>,
  method: 'GET' | 'POST'
): AjaxResponseTypes<ResponseTemplate<T>, true> => {
  return cancelOldAjax<ResponseTemplate<T>, true>(
    serverConfig.serverBaseUrl + url,
    data,
    method
  )
}

export default {}
