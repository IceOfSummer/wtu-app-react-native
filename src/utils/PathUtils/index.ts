/**
 * 从url中获取文件名称(不包含拓展符号)
 * <p>
 * 如传入`xx/xxx/image.png`，则会返回image
 * @param url {string} url
 * @return {string} 文件名称
 */
export const getFilenameFromUrl = (url?: string): string => {
  if (!url) {
    return ''
  }
  const start = url.lastIndexOf('/') + 1
  const end = url.lastIndexOf('.')
  return url.substring(start, end)
}
