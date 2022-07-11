import updateConfig from '../../../update.json'
import { Linking, Platform } from 'react-native'
import { useEffect } from 'react'
import {
  checkUpdate,
  downloadUpdate,
  switchVersionLater,
} from 'react-native-update'
import NativeDialog from '../../native/modules/NativeDialog'

// @ts-ignore
const { appKey } = updateConfig[Platform.OS]

function useUpdateCheck() {
  useEffect(() => {
    checkAppUpdate()
  }, [])
}

/**
 * 返回true表示不用更新
 */
export async function checkAppUpdate() {
  return new Promise<boolean>(resolve => {
    checkUpdate(appKey)
      .then(resp => {
        if (!resp) {
          NativeDialog.showDialog({
            title: '检查更新失败',
            message: '请稍后重试',
            hideCancelBtn: true,
          })
          return
        }
        if (resp.expired) {
          NativeDialog.showDialog({
            title: '发现新版本',
            message: '当前版本过旧, 是否前往下载新版本?',
            onConfirm() {
              Linking.openURL(global.constant.downloadUrl).catch(e =>
                console.log(e)
              )
            },
          })
          resolve(false)
        } else if (!resp.upToDate) {
          // hot update available, force download here
          downloadUpdate(resp)
            .then(hash => {
              if (hash) {
                switchVersionLater(hash)
              } else {
                console.error('hot update fail')
              }
            })
            .catch(e => {
              NativeDialog.showDialog({
                title: '下载热更新失败',
                message: '请求助开发人员或稍后再试: ' + e,
                hideCancelBtn: true,
              })
            })
          resolve(false)
        }
        resolve(true)
      })
      .catch(e => {
        if (__DEV__) {
          console.log(`热更新失败: ${e}`)
        } else {
          NativeDialog.showDialog({
            title: '热更新失败',
            message: '请求助开发人员或稍后再试: ' + e,
            hideCancelBtn: true,
          })
        }
      })
  })
}

export default useUpdateCheck
