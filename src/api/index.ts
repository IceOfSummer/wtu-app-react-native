import { axios } from 'axios-simple-wrapper'
import Toast from 'react-native-toast-message'
import { SCHOOL_AUTH } from '../router'
import { existInput } from '../utils/htmlUtils'

const initInterceptors = () => {
  axios.interceptors.response.use(resp => {
    if (typeof resp.data === 'string') {
      const usernameInput = existInput(resp.data, 'yhm')
      const passwordInput = existInput(resp.data, 'mm')
      if (usernameInput && passwordInput) {
        // 登录失效
        Toast.show({
          text1: '登录过期',
          text2: '点击重新登录',
          type: 'NavToast',
          props: {
            routerName: SCHOOL_AUTH,
          },
        })
        throw new Error('登录过期')
      }
    }
    if (resp.data) {
      return resp.data
    }
    return {}
  })
  axios.interceptors.request.use(config => {
    config.headers = {
      ...config.headers,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.39',
    }
    return config
  })
}
export default initInterceptors
