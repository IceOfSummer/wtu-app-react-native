import betterAjax, { noRepeatAjax } from 'axios-simple-wrapper'
import { getInputValue } from '../../../utils/htmlUtils'
import { GET_FULL_RESPONSE, IGNORE_LOGIN_EXPIRE } from '../../index'
import { AxiosResponse } from 'axios'
import { isAuthPage } from '../../../utils/AuthUtils'

const AUTH_URL = `https://auth.wtu.edu.cn/authserver/login?service=http%3A%2F%2Fjwglxt.wtu.edu.cn%2Fsso%2Fjziotlogin#${IGNORE_LOGIN_EXPIRE}`
export const initLogin = () =>
  new Promise<InitLoginResponse>((resolve, reject) => {
    noRepeatAjax<string, true>(AUTH_URL)
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
        console.log('init success')
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
  new Promise<LoginStatus>((resolve, reject) => {
    noRepeatAjax<string, true>(
      `${AUTH_URL}#${IGNORE_LOGIN_EXPIRE}`,
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
      .then(body => resolve(getAuthErrorMsg(body)))
      .catch(reject)
  })

/**
 * 测试登录状态
 * #ignoreLoginExpire用于在登录失败后不弹出Toast
 * @see /src/api/index.ts
 */
export const testLogin = () =>
  new Promise<LoginStatus>((resolve, reject) => {
    betterAjax<AxiosResponse, true>({
      url: `${AUTH_URL}#${GET_FULL_RESPONSE + IGNORE_LOGIN_EXPIRE}`,
      rejectPolicy: 'NO_POLICY',
    })
      .then(resp => {
        if (isAuthPage(resp.request.responseURL)) {
          // fail
          resolve({
            isSuccess: false,
            message: '登录失败',
          })
          return
        }
        resolve({
          isSuccess: true,
          message: '登录成功',
        })
      })
      .catch(reject)
  })

/**
 * 检查登录状态
 * @param body 响应体
 */
function getAuthErrorMsg(body: string): LoginStatus {
  const match = body.match(/<span id="msg" class="auth_error".+</)
  if (match == null) {
    // success
    return {
      isSuccess: true,
      message: '登录成功',
    }
  } else {
    const errMsg = match[0].replace(/<.+>/, '').replace('<', '')
    return {
      isSuccess: false,
      message: errMsg,
    }
  }
}

export type LoginStatus = {
  isSuccess: boolean
  message: string
}

/**
 * 登出教务系统
 */
export const logoutEduSystem = () =>
  noRepeatAjax(
    'https://auth.wtu.edu.cn/authserver/logout?service=https%3A%2F%2Fauth.wtu.edu.cn%2Fauthserver%2Findex.do'
  )
