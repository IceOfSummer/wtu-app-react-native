import config from '../../../config.json'
type Env = {
  cos: {
    bucket: string
    region: string
    cosUrl: string
  }
  cdnUrl: string
  serverBaseUrl: string
  chatServerHost: string
  chatServerPort: number
  /**
   * 邮箱地址
   */
  support: string
}

let Environment: Env

if (__DEV__) {
  Environment = {
    cos: {
      bucket: config.common.bucket,
      cosUrl: config.common.cosUrl,
      region: config.common.region,
    },
    cdnUrl: config.common.cdnUrl,
    chatServerHost: config.debug.chatServerHost,
    chatServerPort: config.debug.chatServerPort,
    serverBaseUrl: config.debug.serverBaseUrl,
    support: config.common.support,
  }
} else {
  Environment = {
    cos: {
      bucket: config.common.bucket,
      cosUrl: config.common.cosUrl,
      region: config.common.region,
    },
    cdnUrl: config.common.cdnUrl,
    chatServerHost: config.release.chatServerHost,
    chatServerPort: config.release.chatServerPort,
    serverBaseUrl: config.release.serverBaseUrl,
    support: config.common.support,
  }
}

// freeze the object
Object.freeze(Environment)

export default Environment
