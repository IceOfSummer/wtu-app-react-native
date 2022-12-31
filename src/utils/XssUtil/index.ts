import xss, { IFilterXSSOptions } from 'xss'

const options: IFilterXSSOptions = {
  onIgnoreTagAttr: (tag, name, value) => {
    if (name === 'style') {
      return `style="${value}"`
    }
  },
  css: false,
}
export const processHtml = (html?: string): string => {
  if (!html) {
    return ''
  }
  return xss(html, options)
}
