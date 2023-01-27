import { getLogger } from '../utils/LoggerUtils'

const messageMapping: Record<string, string> = {
  'Network Error': '连接服务器失败, 请检查您的网络',
}

const logger = getLogger('/api/util')

/**
 * 将错误信息转换为汉语
 * @param message 错误信息
 */
export function toNativeErrorMessage(message: string): string {
  const msg = messageMapping[message]
  if (msg) {
    return msg
  }
  logger.warn(`the message '${message}' has no mapping to use`)
  return message
}
