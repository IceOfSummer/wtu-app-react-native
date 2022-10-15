import config from '../../config.json'
interface ServerConfig {
  /**
   * 跳蚤市场服务器url
   */
  serverBaseUrl: string
  /**
   * 聊天服务器url
   */
  chatServerUrl: string
}

let serverConfig: ServerConfig

if (__DEV__) {
  serverConfig = config.debug
} else {
  serverConfig = config.release
}

export default serverConfig
