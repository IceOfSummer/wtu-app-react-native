/**
 * 从url中获取文件名称
 * <p>
 * 如传入`xx/xxx/image.png`，则会返回image.png
 * @param url {string} url
 * @return {string} 文件名称
 */
export const getFilenameFromUrl = (url?: string): string => {
  if (!url) {
    return ''
  }
  return url.substring(url.lastIndexOf('/') + 1)
}
