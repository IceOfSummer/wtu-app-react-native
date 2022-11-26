import { serverNoRepeatAjax } from '../../request'
import config from '../../../../config.json'
import fs from 'react-native-fs'
import ByteBuffer from 'bytebuffer'
import { getLogger } from '../../../utils/LoggerUtils'

export type SignInfo = {
  path: string
  sign: string
}

const logger = getLogger('/api/server/cos')

const getUserSpaceUploadSign = (count: number, type?: string) =>
  serverNoRepeatAjax<Array<SignInfo>>('/cos/secret/userspace', { count, type })

/**
 * 上传文件到cos桶
 */
function putObject(
  filePath: string,
  signInfo: SignInfo,
  contentType: string,
  headers?: Record<string, string>
) {
  return new Promise<void>(async (resolve, reject) => {
    const byteBuffer = ByteBuffer.fromBase64(
      await fs.readFile(filePath, 'base64')
    )
    logger.debug('start put object')
    fetch(config.common.cosUrl + signInfo.path, {
      method: 'PUT',
      headers: {
        ...headers,
        Authorization: signInfo.sign,
        'Content-Type': contentType,
      },
      body: byteBuffer.buffer,
    })
      .then(resp => {
        resp.text().then(txt => {
          logger.debug(txt)
          if (resp.status === 200) {
            resolve()
          } else {
            logger.error('上传文件失败')
            reject(new Error(txt))
          }
        })
        if (resp.status === 200) {
        } else {
        }
      })
      .catch(e => {
        reject(e)
      })
  })
}

export const uploadImageToUserspace = (
  uid: number,
  filepath: string,
  signInfo: SignInfo,
  contentType: string
) => {
  return putObject(filepath, signInfo, contentType, {
    'x-cos-meta-uid': uid.toString(),
  })
}

/**
 * 申请用户空间上传签名
 * @param count 要上传的文件数量
 * @param contentType 文件类型，如(application/json)
 */
export const requireUserSpaceUploadSecret = (
  count: number,
  contentType: string
) => {
  const suffix = contentType.substring(contentType.lastIndexOf('/') + 1)
  if (!suffix) {
    throw new Error('无效的文件类型: ' + contentType)
  }
  return getUserSpaceUploadSign(count, '.' + suffix)
}

/**
 * 获取用户空间图片存放位置
 */
export const getUserspaceImagePath = (uid: number, filename: string) =>
  `image/${uid}/${filename}`
