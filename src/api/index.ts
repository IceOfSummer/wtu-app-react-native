/**
 * 不要添加全局响应拦截器
 * @see ./request.ts 在此处添加响应拦截器
 */
import betterAjax, { applyDebounceInterceptor } from 'axios-simple-wrapper'
import axios from 'axios'

betterAjax.default.axios = axios

applyDebounceInterceptor(axios)
axios.defaults.timeout = 3000
axios.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.39',
  }
  return config
})

export default {}
