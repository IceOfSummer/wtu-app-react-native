import { axios } from 'axios-simple-wrapper'
import redux from '../redux/store'
import { modifyLoginStatus } from '../redux/actions/user'
import Toast from 'react-native-toast-message'
import { SCHOOL_AUTH } from '../router'

const initInterceptors = () => {
  axios.interceptors.response.use(resp => {
    const curUrl = resp.request.responseURL as string
    const originUrl = resp.request._url as string
    if (
      !originUrl.startsWith('https://auth.wtu.edu.cn/authserver/login') &&
      curUrl !== originUrl
    ) {
      // 重定向了, 说明登录过期
      redux.store.dispatch(modifyLoginStatus(true))
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
    if (resp.data) {
      return resp.data
    }
    return {}
  })
}
export default initInterceptors
