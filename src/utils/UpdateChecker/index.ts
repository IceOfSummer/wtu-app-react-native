import CodePush from 'react-native-code-push'
import { getLogger } from '../LoggerUtils'
import NativeDialog from '../../native/modules/NativeDialog'
import { Linking } from 'react-native'
import Environment from '../Environment'
import UpdateState = CodePush.UpdateState

const logger = getLogger('/utils/UpdateChecker')
export default class UpdateChecker {
  private static _newVersion: string | undefined

  static get newVersion(): string | undefined {
    return this._newVersion
  }

  public static getVersionLabel(): Promise<string | undefined> {
    return CodePush.getUpdateMetadata(UpdateState.RUNNING).then(meta => {
      return meta?.label
    })
  }

  public static checkUpdate(currentVersion?: string) {
    if (__DEV__) {
      return Promise.resolve(false)
    }
    if (
      UpdateChecker._newVersion &&
      UpdateChecker._newVersion === currentVersion
    ) {
      UpdateChecker.downLoadNewVersion(UpdateChecker._newVersion).catch(e => {
        logger.error('download new version failed: ' + e.message)
      })
      return Promise.resolve(true)
    }
    return new Promise<boolean>(resolve => {
      logger.info('checking update...')
      let flag = true
      CodePush.checkForUpdate(undefined, async r => {
        logger.info('new version found: ' + r.appVersion)
        this._newVersion = r.appVersion
        await UpdateChecker.downLoadNewVersion(r.appVersion)
        if (flag) {
          resolve(true)
          flag = false
        }
      })
        .then(update => {
          if (update) {
            logger.info('hot update available: ' + update.label)
            update
              .download()
              .then(resource => {
                resource
                  .install(CodePush.InstallMode.ON_NEXT_RESTART)
                  .then(() => {
                    CodePush.notifyAppReady().then()
                  })
              })
              .catch(e => {
                logger.error('download hot update failed: ' + e.message)
              })
          } else {
            logger.info('no hot update available!')
          }
        })
        .catch(e => {
          logger.error('checkForUpdate fail: ' + e.message)
        })
        .finally(() => {
          if (flag) {
            resolve(false)
          }
        })
    })
  }

  private static async downLoadNewVersion(version: string) {
    NativeDialog.showDialog({
      title: '当前版本过低',
      message: '是否下载新版本?',
      onConfirm: () => {
        Linking.openURL(`${Environment.cdnUrl}/app/${version}.apk`)
      },
    })
  }
}
