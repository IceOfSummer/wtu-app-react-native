const VALUE_IN_INPUT_REGX = /value=".*"/
/**
 * 获取html中某个input的value
 * @param html {string} html
 * @param inputName {string} input的名称
 */
export const getInputValue = (
  html: string | undefined,
  inputName: string
): string | null => {
  if (!html) {
    return null
  }
  //<input type="hidden" id="localeKey" name="localeKey" value="zh_CN" />
  const intRegx = new RegExp('<input.* name="' + inputName + '".*>')
  const match = html.match(intRegx)
  if (match == null) {
    return null
  }
  const matchValue = match[0].match(VALUE_IN_INPUT_REGX)
  if (matchValue == null) {
    return null
  }
  return matchValue[0]
    .replace(/"/g, '')
    .replace('value=', '')
    .replace(/\\/g, '')
}

/**
 * 判断某个输入框是否存在
 * @param html {string} html
 * @param id {string} input的id
 */
export const existInput = (html: string, id: string): boolean => {
  const intRegx = new RegExp('<input.* id="' + id + '".*>')
  return !!html.match(intRegx)
}
