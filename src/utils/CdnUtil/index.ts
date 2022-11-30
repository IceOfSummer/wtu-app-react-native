import config from '../../../config.json'
export const appendCdnPrefix = (url: string): string => {
  if (url[0] !== '/') {
    return config.common.cdnUrl + '/' + url
  }
  return config.common.cdnUrl + url
}
