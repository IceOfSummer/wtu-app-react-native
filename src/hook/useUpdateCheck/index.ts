import { useEffect } from 'react'
import CodePush from 'react-native-code-push'
import NativeDialog, {
  quickShowErrorTip,
} from '../../native/modules/NativeDialog'

function useUpdateCheck() {
  useEffect(() => {
    if (!__DEV__) {
      CodePush.checkForUpdate()
        .then(update => {
          if (update) {
            NativeDialog.showDialog({
              title: '有新更新可用',
              message: '',
              hideCancelBtn: true,
            })
            update.download().then(resource => {
              resource.install(CodePush.InstallMode.ON_NEXT_RESTART).then()
            })
          } else {
            NativeDialog.showDialog({
              title: '没有新更新',
              message: '',
              hideCancelBtn: true,
            })
          }
        })
        .catch(e => {
          quickShowErrorTip('更新失败', e.message)
        })
    }
  }, [])
}

/**
 * 返回true表示不用更新
 */
export async function checkAppUpdate(): Promise<boolean> {
  return Promise.resolve(true)
}

export default useUpdateCheck
