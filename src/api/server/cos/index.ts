import { serverNoRepeatAjax } from '../../request'
import fs from 'react-native-fs'
import ByteBuffer from 'bytebuffer'
import { getLogger } from '../../../utils/LoggerUtils'
import { getFileExtension } from '../../../utils/PathUtils'
import Environment from '../../../utils/Environment'

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

type OnProgress = (current: number, total: number) => void
/**
 * 上传文件到cos桶
 */
function putObject(
  filePath: string,
  signInfo: SignInfo,
  contentType: string,
  headers?: Record<string, string>,
  onProgress?: OnProgress
) {
  return new Promise<void>(async (resolve, reject) => {
    const byteBuffer = ByteBuffer.fromBase64(
      await fs.readFile(filePath, 'base64')
    )
    logger.debug('start put object')
    const request = new XMLHttpRequest()
    request.open('PUT', Environment.cos.cosUrl + signInfo.path, true)
    request.setRequestHeader('Authorization', signInfo.sign)
    request.setRequestHeader('Content-Type', contentType)
    if (headers) {
      Object.keys(headers).forEach(key => {
        request.setRequestHeader(key, headers[key])
      })
    }
    request.upload.addEventListener('progress', e => {
      onProgress?.(e.loaded, e.total)
    })
    request.addEventListener('readystatechange', () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          resolve()
        } else {
          const body = request.responseText
          logger.error('upload image failed: ' + body)
          reject(new Error('上传文件失败, 请稍后再试'))
        }
      }
    })
    request.timeout = 10000
    request.addEventListener('error', () => {
      reject(new Error('上传文件失败, 请稍后再试'))
    })
    request.addEventListener('abort', () => {
      reject(new Error('上传被取消'))
    })
    request.send(byteBuffer.buffer)
  })
}

export const uploadImageToUserspace = (
  uid: number,
  filepath: string,
  signInfo: SignInfo,
  contentType: string,
  onProgress?: OnProgress
) => {
  return putObject(
    filepath,
    signInfo,
    contentType,
    {
      'x-cos-meta-uid': uid.toString(),
    },
    onProgress
  )
}

export const uploadAvatar = (
  uid: number,
  signInfo: SignInfo,
  contentType: string,
  filepath: string,
  onProgress?: OnProgress
) => {
  return putObject(
    filepath,
    signInfo,
    contentType,
    {
      'x-cos-meta-uid': uid.toString(),
    },
    onProgress
  )
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
  contentType: string,
  onProgress?: OnProgress
) => {
  return putObject(filepath, signInfo, contentType, undefined, onProgress)
}

/**
 * 获取用户空间图片存放位置
 */
export const getUserspaceImagePath = (uid: number, filename: string) =>
  `image/${uid}/${filename}`
