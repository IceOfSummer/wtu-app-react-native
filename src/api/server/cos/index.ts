import { serverNoRepeatAjax } from '../../request'
import config from '../../../../config.json'
import fs from 'react-native-fs'
import ByteBuffer from 'bytebuffer'
import { getLogger } from '../../../utils/LoggerUtils'
import { getFileExtension } from '../../../utils/PathUtils'

export type SignInfo = {
  path: string
  sign: string
}

const logger = getLogger('/api/server/cos')

const getUserSpaceUploadSign = (count: number, types?: string) =>
  serverNoRepeatAjax<Array<SignInfo>>('/cos/secret/userspace', { count, types })

/**
 * 获取头像上传签名
 * @param type 图片类型，如`png`
 */
export const requireAvatarUploadSign = (type: string) => {
  if (type[0] !== '.') {
    type = '.' + type
  }
  return serverNoRepeatAjax<SignInfo>('/cos/secret/avatar', { t: type })
}

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

export const uploadAvatar = (
  uid: number,
  signInfo: SignInfo,
  contentType: string,
  filepath: string
) => {
  return putObject(filepath, signInfo, contentType, {
    'x-cos-meta-uid': uid.toString(),
  })
}

enum ImageType {
  PNG,
  JPEG,
  GIF,
  WEBP,
}

const getImageTypeFromContentType = (contentType: string) => {
  switch (contentType) {
    case 'image/png':
      return ImageType.PNG
    case 'image/jpeg':
      return ImageType.JPEG
    case 'image/gif':
      return ImageType.GIF
    case 'image/webp':
      return ImageType.WEBP
    default:
      throw new Error(`不支持上传${contentType}类型的图片`)
  }
}

const getImageTypeFromUrl = (url: string) => {
  return 'image/' + getFileExtension(url)
}

type SignInfoWithType = SignInfo & {
  contentType: string
}

/**
 * 申请用户空间上传签名
 * @param contentTypes 文件类型，如(image/png), 长度必须和count相同
 */
export const requireUserSpaceUploadSecret = async (
  contentTypes: string[]
): Promise<SignInfoWithType[]> => {
  let types = ''
  contentTypes.forEach(value => {
    types += getImageTypeFromContentType(value) + ','
  })
  const { data } = await getUserSpaceUploadSign(contentTypes.length, types)
  const result: Array<SignInfoWithType> = []
  data.forEach(value => {
    result.push({
      ...value,
      contentType: getImageTypeFromUrl(value.path),
    })
  })
  return result
}

export const requirePublicSpaceUploadSecret = (contentType: string) => {
  const suffix = contentType.substring(contentType.lastIndexOf('/') + 1)
  if (!suffix) {
    throw new Error('无效的文件类型: ' + contentType)
  }
  return serverNoRepeatAjax<SignInfo>('/cos/secret/public', { t: '.' + suffix })
}

export const uploadFileToPublicSpace = (
  signInfo: SignInfo,
  filepath: string,
  contentType: string
) => {
  return putObject(filepath, signInfo, contentType)
}

/**
 * 获取用户空间图片存放位置
 */
export const getUserspaceImagePath = (uid: number, filename: string) =>
  `image/${uid}/${filename}`
