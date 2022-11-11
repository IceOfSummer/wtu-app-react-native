import { CaseReducer, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'

export interface TemporaryDataState {
  /**
   * 检查登录状态是否完成
   */
  isCheckLoginDone: boolean
  /**
   * 全局状态, 可存放任意键值对, 使用时请注意安全 :)
   */
  globalStates: any
  /**
   * 聊天服务器是否连接失败
   */
  isChatServerConnectFailed?: boolean
}

export type GlobalStateAvailableTypes =
  | Record<string, any>
  | string
  | number
  | Array<unknown>

export interface TemporaryDataReducers
  extends SliceCaseReducers<TemporaryDataState> {
  /**
   * 标记检查登录成功
   */
  markCheckLoginDone: CaseReducer<TemporaryDataState, PayloadAction<undefined>>
  /**
   * 保存全局临时状态
   */
  saveGlobalState: CaseReducer<
    TemporaryDataState,
    PayloadAction<GlobalStateAvailableTypes>
  >
  /**
   * 修改仅有键值对的属性
   */
  modifyKVData: CaseReducer<
    TemporaryDataState,
    PayloadAction<Partial<TemporaryDataState>>
  >
}
