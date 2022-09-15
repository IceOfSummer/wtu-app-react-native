interface ServerConfig {
  /**
   * 跳蚤市场服务器url
   */
  serverBaseUrl: string
  /**
   * 服务器成功代码
   */
  successCode: unknown
}

const serverConfig: ServerConfig = {
  serverBaseUrl: '',
  successCode: 0,
}

if (__DEV__) {
  serverConfig.serverBaseUrl = 'http://10.181.130.47:8080'
} else {
  // TODO
  serverConfig.serverBaseUrl = ''
}

export default serverConfig
