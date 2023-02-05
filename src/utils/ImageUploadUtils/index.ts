import {
  requirePublicSpaceUploadSecret,
  SignInfo,
  uploadFileToPublicSpace,
} from '../../api/server/cos'
import PublicData from '../../sqlite/public_data'
import LinkedStack from '../Collection/LinkedStack'

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
   */
  public static async uploadImageToPublicSpace(
    filepath: string,
    contentType: string
  ): Promise<string> {
    let path
    try {
      path = await PublicData.get(filepath)
    } catch (ignored) {}
    if (path) {
      return path
    }
    let sign = this.secretStack.peek()
    if (!sign) {
      sign = (await requirePublicSpaceUploadSecret(contentType)).data
      this.secretStack.push(sign)
    }
    await uploadFileToPublicSpace(sign, filepath, contentType)
    this.secretStack.pop()
    try {
      await PublicData.set(filepath, sign.path)
    } catch (ignored) {}
    return sign.path
  }
}
