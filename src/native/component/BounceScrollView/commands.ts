import { MutableRefObject } from 'react'
// @ts-ignore
import { dispatchCommand } from 'react-native/Libraries/Renderer/shims/ReactNative'

export const finishFresh = (ref: MutableRefObject<unknown>, status?: boolean) =>
  dispatchCommand(ref.current, 'finishRefresh', [status])
