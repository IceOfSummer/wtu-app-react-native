import betterAjax, { axios } from 'axios-simple-wrapper'
import Toast from 'react-native-toast-message'
import { SCHOOL_AUTH } from '../router'
import { store } from '../redux/store'
import { markLoginExpired } from '../redux/actions/user'
import { isAuthPage } from '../utils/AuthUtils'

// 当登录过期后, 不显示Toast
export const IGNORE_LOGIN_EXPIRE = 'ignoreLoginExpire;'
const IGNORE_LOGIN_EXPIRE_REGX = /#.*ignoreLoginExpire/
// 返回完整的响应信息
export const GET_FULL_RESPONSE = 'getFullResponse;'
const GET_FULL_RESPONSE_REGX = /#.*getFullResponse/

betterAjax.rejectMessage = '您的手速太快了! 请稍后再试!'
axios.interceptors.response.use(
  resp => {
    const requestUrl = resp.request._url
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
  },
  error => {
    console.log(error)
  }
)
axios.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.39',
  }
  return config
})

export default {}
