import { noRepeatAjax } from 'axios-simple-wrapper'
import { getInputValue } from '../../../utils/htmlUtils'

const AUTH_URL =
  'https://auth.wtu.edu.cn/authserver/login?service=http%3A%2F%2Fjwglxt.wtu.edu.cn%2Fsso%2Fjziotlogin'
export const initLogin = () =>
  new Promise<InitLoginResponse>((resolve, reject) => {
    noRepeatAjax<string>(AUTH_URL)
      .then(data => {
        const lt = getInputValue(data, 'lt')
        if (!lt) {
          // 登录了
          resolve(null)
          return
        }
        const match = data.match(/var pwdDefaultEncryptSalt = ".+"/)
        if (!match || !match[0]) {
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
  username: string,
  execution: string
) =>
  noRepeatAjax<string>(
    AUTH_URL,
    {
      username,
      password: encodeURIComponent(password),
      captchaResponse: captcha,
      rememberMe: 'on',
      lt,
      dllt: 'userNamePasswordLogin',
      execution: execution,
      _eventId: 'submit',
      rmShown: 1,
    },
    'POST'
  )
