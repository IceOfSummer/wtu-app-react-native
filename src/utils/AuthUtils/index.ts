const AUTH_SERVER = 'https://auth.wtu.edu.cn/authserver/login'
const EDU_SYSTEM_AUTH = 'http://jwglxt.wtu.edu.cn/xtgl/login_slogin.html'

/**
 * 检查登录是否过期
 * @param url 响应的url
 */
export const isAuthPage = (url: string): boolean => {
  return url.startsWith(AUTH_SERVER) || url.startsWith(EDU_SYSTEM_AUTH)
}
