import { noRepeatAjax, axios } from 'axios-simple-wrapper'
import { getInputValue } from '../../../utils/htmlUtils'

axios.interceptors.response.use(resp => {
  if (resp.data) {
    return resp.data
  }
  return {}
})

export const initLogin = () =>
  new Promise<InitLoginResponse>((resolve, reject) => {
    noRepeatAjax<string>(
      'https://auth.wtu.edu.cn/authserver/login?service=http%3A%2F%2Fjwglxt.wtu.edu.cn%2Fsso%2Fjziotlogin'
    )
      .then(data => {
        const lt = getInputValue(data, 'lt')
        if (!lt) {
          // 登录了
          resolve(null)
          return
        }
        const match = data.match(/var pwdDefaultEncryptSalt = ".+"/)
        if (!match) {
          // 登录了
          resolve(null)
          return
        }
        const encryptSalt = match[0]
          .replace('var pwdDefaultEncryptSalt = ', '')
          .replace(/"/g, '')

        // 必定存在, 不可能为空
        const execution = getInputValue(data, 'execution') as string

        resolve({
          encryptSalt,
          lt,
          execution,
        })
      })
      .catch(reject)
  })

export type InitLoginResponse = null | {
  lt: string
  encryptSalt: string
  execution: string
}

/**
 * 登录
 */
export const login = (
  lt: string,
  password: string,
  captcha: string,
  username: string
) =>
  noRepeatAjax<string>(
    'https://auth.wtu.edu.cn/authserver/login?service=http%3A%2F%2Fjwglxt.wtu.edu.cn%2Fsso%2Fjziotlogin',
    {
      username,
      password,
      captchaResponse: captcha,
      rememberMe: 'on',
      lt,
      dllt: 'userNamePasswordLogin',
      execution: 'e2s1',
      _eventId: 'submit',
      rmShown: 1,
    },
    'POST'
  )
