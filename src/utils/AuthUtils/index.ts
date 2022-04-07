const AUTH_SERVER = 'https://auth.wtu.edu.cn/authserver/login'

/**
 * 检查登录是否过期
 * @param url 响应的url
 */
export const isAuthPage = (url: string): boolean => {
  return url.startsWith(AUTH_SERVER)
}
