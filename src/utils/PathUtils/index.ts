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

/**
 * 从url中获取文件描述符
 * @param url url
 * @return 文件描述符，如果没有则返回空字符串
 */
export const getFileExtension = (url?: string): string => {
  if (!url) {
    return ''
  }
  let endIndex: number | undefined = url.lastIndexOf('?')
  if (endIndex < 0) {
    endIndex = undefined
  } else {
    endIndex--
  }
  const startIndex = url.lastIndexOf('.', endIndex)
  return url.substring(startIndex + 1, endIndex)
}
