import config from '../../../config.json'
export const appendCdnPrefix = (url: string): string => {
  return config.common.cdnUrl + url
}
