export enum UserActionConstant {
  /**
   * 保存用户信息
   */
  saveUserCredentials = 'userAction_saveUserCredentials',
  /**
   * 更改登录状态, true为过期, false为有效
   */
  modifyLoginStatus = 'userAction_modifyLoginStatus',
  /**
   * 标记用户已经登录, 并且异步加载并保存用户信息
   */
  markLogin = 'userAction_markLogin',
  /**
   * 保存用户信息
   */
  saveUserInfo = 'userAction_saveUserInfo',
}
