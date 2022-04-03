export enum UserActionConstant {
  /**
   * 保存用户信息
   */
  saveUserCredentials = 'userAction_saveUserCredentials',
  /**
   * 更改登录状态, true为有效, false为过期
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

export enum LessonsTableActionConstant {
  /**
   * 修改课程表设置
   */
  modifyOptions = 'lessonsTableAction_modifyOptions',
  /**
   * 保存课表信息
   */
  saveLessonsInfo = 'lessonsTableAction_saveLessonsInfo',
  /**
   * 更新当前周
   */
  updateCurWeek = 'lessonsTableAction_updateCurWeek',
}
