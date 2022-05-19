export interface TemporaryDataState {
  /**
   * 检查登录状态是否完成
   */
  isCheckLoginDone: boolean
  /**
   * 全局状态, 可存放任意键值对, 使用时请注意安全 :)
   */
  globalStates: any
}
