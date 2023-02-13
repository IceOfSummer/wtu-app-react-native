import {
  getUserspaceImagePath,
  requirePublicSpaceUploadSecret,
  requireUserSpaceUploadSecret,
  SignInfo,
  uploadFileToPublicSpace,
  uploadImageToUserspace,
} from '../../api/server/cos'
import PublicData from '../../sqlite/public_data'
import LinkedStack from '../Collection/LinkedStack'
import { getLogger } from '../LoggerUtils'
import { getFilenameFromUrl } from '../PathUtils'
import Loading from '../../component/Loading'

const logger = getLogger('/utils/ImageUploadUtils')

export type ImageResource = {
  filepath: string
  /**
   * 缓存图片时使用哪个key，若不提供，则默认使用filepath
   */
  key?: string
  contentType: string
}

/**
 * 图片上传工具类。
 * <p>
 * 使用该工具类上传的图片会被缓存，再次上传时则会直接使用缓存的url以避免二次上传
 */
export default class ImageUploadUtils {
  private constructor() {}

  /**
   * 保存图片上传失败时的上传密匙，在申请密匙前应检查该队列，避免重复申请密匙.
   * @private
   * - key: contentType
   * - value: signCache
   */
  private static secretMap = new Map<string, LinkedStack<SignInfo>>()

  /**
   * 立刻上传图片到公共空间. 该方法会调用{@link Loading#showLoading}
   * @param filepath 图片路径
   * @param contentType 文件类型
   * @param key 用于辨别文件的标识符
   */
  public static async uploadImageToPublicSpace(
    filepath: string,
    contentType: string,
    key: string = filepath
  ): Promise<string> {
    const path = await this.resolveImageCache(key)
    logger.info('uploading image to public space')
    if (path) {
      logger.info('cache hit! return cached url.')
      return path
    }
    const stack = this.safeGetStack(key)
    let sign = stack.peek()
    if (!sign) {
      logger.info('requiring upload secret...')
      sign = (await requirePublicSpaceUploadSecret(contentType)).data
      stack.push(sign)
    }
    logger.info('start upload')
    await uploadFileToPublicSpace(sign, filepath, contentType, this.onProgress)
    logger.info('upload success!')
    stack.pop()
    this.setImageCache(key, sign.path)
    return sign.path
  }

  private static safeGetStack(key: string) {
    let stack = this.secretMap.get(key)
    if (!stack) {
      stack = new LinkedStack<SignInfo>()
      this.secretMap.set(key, stack)
    }
    return stack
  }

  private static safeSetValue(key: string, value: SignInfo) {
    const stack = this.safeGetStack(key)
    stack.push(value)
  }

  public static async uploadImagesToUserspace(
    uid: number,
    images: ImageResource[]
  ): Promise<string[]> {
    if (images.length === 0) {
      return []
    }
    logger.info('uploading images to userspace...')
    const resultList: Array<string> = []
    const secretRequireList: Array<string> = []
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const key = image.key ?? image.filepath
      const result = await this.resolveImageCache(key)
      if (result) {
        logger.info('image cache hit, key: ' + key)
        resultList[i] = result
      } else {
        const stack = this.safeGetStack(image.contentType)
        if (stack.isEmpty()) {
          secretRequireList.push(image.contentType)
        }
      }
    }
    logger.info(`require ${secretRequireList.length} sign info`)
    if (secretRequireList.length > 0) {
      const data = await requireUserSpaceUploadSecret(secretRequireList)
      logger.info(`total requested ${data.length} secrets`)
      data.forEach(value => {
        this.safeSetValue(value.contentType, value)
      })
    }
    logger.info('start upload!')
    for (let i = 0; i < images.length; i++) {
      if (!resultList[i]) {
        const img = images[i]
        const stack = this.safeGetStack(img.contentType)
        const secret = stack.peek()
        if (!secret) {
          logger.warn('the secret is undefined! images: ' + images)
          throw new Error('出现未知错误，请重试')
        }
        await uploadImageToUserspace(
          uid,
          img.filepath,
          secret,
          img.contentType,
          this.onProgress
        )
        const realPath =
          getUserspaceImagePath(uid, getFilenameFromUrl(secret.path)) + '.webp'
        logger.debug(`realPath = ${realPath}, secret.path = ${secret.path}`)
        this.setImageCache(img.key ?? img.filepath, realPath)
        stack.pop()
        resultList[i] = realPath
      }
    }
    logger.debug('resultList: ' + resultList)
    return resultList
  }

  public static async resolveImageCache(filepath: string) {
    try {
      return await PublicData.get(filepath)
    } catch (e: any) {
      logger.error('get publicData failed: ' + e.message)
    }
  }

  public static setImageCache(filepath: string, url: string) {
    logger.info(`set image cache, path = ${filepath}, url = ${url}`)
    PublicData.set(filepath, url).catch(e => {
      logger.error('set publicData failed: ' + e.message)
    })
  }

  private static onProgress(current: number, total: number) {
    const currentMb = current / 1024
    const totalMb = total / 1024
    Loading.showLoading(`上传图片中: ${currentMb}Kb/${totalMb}Kb`)
  }
}
