import {
  requirePublicSpaceUploadSecret,
  SignInfo,
  uploadFileToPublicSpace,
} from '../../api/server/cos'
import PublicData from '../../sqlite/public_data'
import LinkedStack from '../Collection/LinkedStack'
import { getLogger } from '../LoggerUtils'

const logger = getLogger('/utils/ImageUploadUtils')

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
   */
  private static secretStack = new LinkedStack<SignInfo>()

  /**
   * 立刻上传图片到公共空间
   * @param filepath 图片路径
   * @param contentType 文件类型
   * @param key 用于辨别文件的标识符
   */
  public static async uploadImageToPublicSpace(
    filepath: string,
    contentType: string,
    key: string = filepath
  ): Promise<string> {
    let path
    logger.info('uploading image to public space')
    try {
      path = await PublicData.get(key)
    } catch (e: any) {
      logger.error('get publicData failed: ' + e.message)
    }
    if (path) {
      logger.info('cache hit! return cached url.')
      return path
    }
    let sign = this.secretStack.peek()
    if (!sign) {
      logger.info('requiring upload secret...')
      sign = (await requirePublicSpaceUploadSecret(contentType)).data
      this.secretStack.push(sign)
    }
    logger.info('start upload')
    await uploadFileToPublicSpace(sign, filepath, contentType)
    logger.info('upload success!')
    this.secretStack.pop()
    try {
      await PublicData.set(key, sign.path)
    } catch (e: any) {
      logger.error('set publicData failed: ' + e.message)
    }
    return sign.path
  }
}
