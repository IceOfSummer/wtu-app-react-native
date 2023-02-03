import { getLogger } from '../utils/LoggerUtils'

const statusCodeMapping: Record<string, string> = {
  '403': '您的访问权限不足',
  '500': '服务器异常，请稍后再试',
  '502': '网关异常，服务器已关闭或正在重启',
}

const logger = getLogger('/api/util')
type ErrorLike = {
  code?: string
  message: string
}

/**
 * 将错误信息转换为汉语
 * @param error 错误信息
 */
export function toNativeErrorMessage(error: ErrorLike): string {
  let message: string
  if (typeof error === 'object') {
    if (error.code) {
      message = statusCodeMapping[error.code]
    } else {
      message = error.message
    }
    if (!message) {
      logger.warn(`the error object '${error}' has no mapping to use`)
      message = error.message
    }
  } else {
    message = statusCodeMapping[error]
  }
  return message
}
