import CodePush from 'react-native-code-push'
import { getLogger } from '../LoggerUtils'
import NativeDialog from '../../native/modules/NativeDialog'
import { Linking } from 'react-native'
import Environment from '../Environment'
import UpdateState = CodePush.UpdateState
import Toast from 'react-native-root-toast'

const logger = getLogger('/utils/UpdateChecker')
export default class UpdateChecker {
  private static _newBinaryVersion: string | undefined

  static get newBinaryVersion(): string | undefined {
    return this._newBinaryVersion
  }

  public static getVersionLabel(): Promise<string | undefined> {
    return CodePush.getUpdateMetadata(UpdateState.RUNNING).then(meta => {
      return meta?.label
    })
  }

  /**
   * 检查更新
   * @param notice 有热更新时是否提醒
   */
  public static checkUpdate(notice?: boolean) {
    if (__DEV__) {
      return
    }
    logger.info('checking update...')
    CodePush.checkForUpdate(undefined, r => {
      logger.info('new version found: ' + r.appVersion)
      UpdateChecker._newBinaryVersion = r.appVersion
      UpdateChecker.downLoadNewVersion(r.appVersion, r.description)
    })
      .then(update => {
        if (update) {
          if (notice) {
            Toast.show('有新的热更新版本了，正在下载!')
          }
          logger.info('hot update available: ' + update.label)
          update
            .download()
            .then(resource => {
              resource
                .install(CodePush.InstallMode.ON_NEXT_RESTART)
                .then(() => {
                  Toast.show('热更新安装完毕，下次重启后生效')
                  CodePush.notifyAppReady().then()
                })
            })
            .catch(e => {
              logger.error('download hot update failed: ' + e.message)
            })
        } else {
          if (notice) {
            Toast.show('已经是最新版本了!')
          }
          logger.info('no hot update available!')
        }
      })
      .catch(e => {
        logger.error('checkForUpdate fail: ' + e.message)
      })
  }

  public static downLoadNewVersion(version: string, message?: string) {
    NativeDialog.showDialog({
      title: '有新版本了!',
      message: message ?? '当前最新版本: ' + version,
      onConfirm: () => {
        Linking.openURL(`${Environment.cdnUrl}/app/${version}.apk`)
      },
    })
  }
}
