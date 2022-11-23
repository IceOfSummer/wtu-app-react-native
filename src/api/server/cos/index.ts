import { serverNoRepeatAjax } from '../../request'
import config from '../../../../config.json'
import fs from 'react-native-fs'
import ByteBuffer from 'bytebuffer'
import { getLogger } from '../../../utils/LoggerUtils'

type SignWrapper = {
  token: string
  signs: Array<SignInfo>
}

type SignInfo = {
  path: string
  sign: string
}

const logger = getLogger('/api/server/cos')

const getUserSpaceUploadSecret = (count: number, type?: string) =>
  serverNoRepeatAjax<SignWrapper>('/cos/secret/userspace', { count, type })

/**
 * 上传文件到cos桶
 */
function putObject(
  filePath: string,
  signInfo: SignInfo,
  token: string,
  contentType: string
) {
  return new Promise<void>(async (resolve, reject) => {
    const byteBuffer = ByteBuffer.fromBase64(
      await fs.readFile(filePath, 'base64')
    )
    fetch(config.common.cosUrl + signInfo.path, {
      method: 'PUT',
      headers: {
        Authorization: signInfo.sign,
        'x-cos-security-token': token,
        'Content-Type': contentType,
      },
      body: byteBuffer.buffer,
    })
      .then(resp => {
        if (__DEV__) {
          resp.text().then(txt => {
            logger.info(txt)
          })
        }
        if (resp.status === 200) {
          resolve()
        } else {
          resp.text().then(txt => {
            logger.error('上传文件失败')
            logger.error(txt)
          })
          reject(new Error('上传失败'))
        }
      })
      .catch(e => {
        reject(e)
      })
  })
}
type UploadStatus = {
  token: string
  // undefined表示上传成功
  signs: Array<SignInfo | undefined>
}

/**
 * 上传图片
 * @param filepath 文件路径
 * @param contentType 文件类型，如`image/png`
 * @param type 文件类型描述符，默认为`.png`
 */
export const uploadImage = (
  filepath: string[],
  contentType: string,
  type: string = '.png'
) =>
  new Promise<UploadStatus>(async resolve => {
    const { data } = await getUserSpaceUploadSecret(filepath.length, type)
    const uploadStatus: Array<SignInfo | undefined> = []
    // up
    for (let i = 0, len = data.signs.length; i < len; i++) {
      const sign = data.signs[i]
      try {
        await putObject(filepath[i], sign, data.token, contentType)
        uploadStatus[i] = undefined
      } catch (e) {
        uploadStatus[i] = sign
      }
    }
    resolve({
      token: data.token,
      signs: uploadStatus,
    })
  })
