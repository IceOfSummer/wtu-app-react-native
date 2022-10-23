import { ResponseTemplate } from './server/types'

/**
 * 将响应根据指定的格式转换
 *
 * 不支持属性嵌套！
 * @param mapping 键值映射
 * @param response 响应内容
 */
export const responseParser = <R>(
  mapping: Record<string, string>,
  response: ResponseTemplate<any>
): ResponseTemplate<R> => {
  if (!response.data) {
    return response
  }
  response.data = parse(mapping, response.data)
  return response
}

/**
 * 解析数组，原理类似responseParser
 * @param mapping 键值映射
 * @param response 响应内容
 */
export const responseArrayParser = <R>(
  mapping: Record<string, string>,
  response: ResponseTemplate<Array<any>>
): ResponseTemplate<Array<R>> => {
  for (let i = 0, len = response.data.length; i < len; ++i) {
    response.data[i] = parse(mapping, response.data[i])
  }
  return response
}

/**
 * 按照mapping解析target
 * @param mapping 映射
 * @param target 要解析的对象
 */
function parse(mapping: Record<string, string>, target: any) {
  const cast: Record<string, any> = {}
  Object.keys(mapping).forEach(key => {
    cast[mapping[key]] = target[key]
  })
  return cast
}
