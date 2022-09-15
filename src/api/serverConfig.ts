interface ServerConfig {
  /**
   * 跳蚤市场服务器url
   */
  serverBaseUrl: string
}

const serverConfig: ServerConfig = {
  serverBaseUrl: '',
}

if (__DEV__) {
  serverConfig.serverBaseUrl = 'http://10.181.205.214:8080'
} else {
  // TODO
  serverConfig.serverBaseUrl = ''
}

export default serverConfig
