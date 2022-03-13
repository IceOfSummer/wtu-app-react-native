import { noRepeatAjax } from 'axios-simple-wrapper'
/**
 * 获取用户信息
 */

export const getUserInfo = () =>
  new Promise<UserInfo>((resolve, reject) => {
    noRepeatAjax<string>(
      'http://jwglxt.wtu.edu.cn/xsxxxggl/xsgrxxwh_cxXsgrxx.html?gnmkdm=N100801&layout=default',
      undefined,
      'GET'
    )
      .then(resp => {
        const splitValue = (str: string) =>
          str.replace('<p class="form-control-static">', '').replace('</p>', '')

        const reg = /<p class="form-control-static">.*<\/p>/g
        const values = resp.match(reg)
        if (!values || values.length === 0) {
          // 请求失败, 登录凭据失效
          reject('登陆过期1')
        }

        // values已经不可能为null了
        const userInfo: UserInfo = {
          id: splitValue(values![0]),
          name: splitValue(values![1]),
          enrollmentDate: splitValue(values![10]),
        }
        resolve(userInfo)
      })
      .catch(e => {
        reject(e)
      })
  })

export type UserInfo = {
  id: string
  name: string
  enrollmentDate: string
}
