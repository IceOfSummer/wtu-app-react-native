import { serverNoRepeatAjax } from '../../request'
import config from '../../../../config.json'
import fs from 'react-native-fs'
import ByteBuffer from 'bytebuffer'
import { getLogger } from '../../../utils/LoggerUtils'

type SignWrapper = {
  token: string
  signs: Array<SignInfo>
}

export type SignInfo = {
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
        if (resp.status === 200) {
          resolve()
        } else {
          resp.text().then(txt => {
            logger.error('上传文件失败')
            logger.error(txt)
            reject(new Error(txt))
          })
        }
      })
      .catch(e => {
        reject(e)
      })
  })
}

export const uploadFile = (
  filepath: string,
  signInfo: SignInfo,
  token: string,
  contentType: string
) => {
  return putObject(filepath, signInfo, token, contentType)
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
  return getUserSpaceUploadSecret(count, '.' + suffix)
}
