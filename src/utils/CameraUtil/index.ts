import { Permission, PermissionsAndroid, Platform } from 'react-native'
import RNFS from 'react-native-fs'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'

function isInvalidName(fileName: string) {
  const index = fileName.indexOf('.')
  return index === 0 || index === fileName.length - 1
}

async function ensurePermission() {
  if (Platform.OS === 'android') {
    const permission: Permission[] = []
    if (
      !(await PermissionsAndroid.check(
        'android.permission.READ_EXTERNAL_STORAGE'
      ))
    ) {
      permission.push('android.permission.READ_EXTERNAL_STORAGE')
    }
    if (
      !(await PermissionsAndroid.check(
        'android.permission.WRITE_EXTERNAL_STORAGE'
      ))
    ) {
      permission.push('android.permission.WRITE_EXTERNAL_STORAGE')
    }
    if (permission.length === 0) {
      return
    }
    const result = await PermissionsAndroid.requestMultiple(permission)
    if (
      result['android.permission.READ_EXTERNAL_STORAGE'] === 'denied' ||
      result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied'
    ) {
      throw new Error('已拒绝存储权限')
    }
  }
}

export const saveImageToLocal = async (url: string, filename?: string) => {
  await ensurePermission()
  if (!filename) {
    const paramIndex = url.indexOf('?')
    let temp = url
    if (paramIndex > 0) {
      temp = url.substring(0, paramIndex)
    }
    filename = temp.substring(temp.lastIndexOf('/') + 1)
    if (isInvalidName(filename)) {
      // 使用随机字符串
      // eslint-disable-next-line no-bitwise
      filename = `wtuapp-${(Math.random() * 1000) | 0}${Date.now()}.png`
    }
  }
  if (Platform.OS === 'android') {
    const downloadDest = `${RNFS.DocumentDirectoryPath}/${filename}`
    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: downloadDest,
    }).promise
    if (result && result.statusCode === 200) {
      await CameraRoll.save('file://' + downloadDest, { type: 'photo' })
    } else {
      throw new Error('下载图片失败, 状态码: ' + result.statusCode)
    }
  } else {
    await CameraRoll.save(url)
  }
}
