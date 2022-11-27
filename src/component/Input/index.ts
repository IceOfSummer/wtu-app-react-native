import { RefObject } from 'react'

export interface InputComponent<
  Value extends (string | undefined) | Array<string>
> {
  value: () => Value
  showErrorText: (errorText: string) => void
  clearErrorText: () => void
}

type FormCheckerConfig<Value extends string | string[]> = Array<
  FormItem<InputComponent<Value>>
>
export const useFormChecker = <V extends string | string[]>(
  config: FormCheckerConfig<V>
) => {
  return {
    checkForm(): Array<FormError<InputComponent<V>>> {
      const errors: Array<FormError<InputComponent<V>>> = []
      config.forEach(item => {
        const current = item.ref.current
        if (!current) {
          return
        }
        let err: FormError<InputComponent<V>> | undefined
        const val = current.value()
        if (!val) {
          if (!item.allowEmpty) {
            err = {
              item,
              reason: item.name + '不可为空',
            }
          }
        } else if (typeof val === 'string') {
          const reason = item.check?.(val, item.name)
          if (reason) {
            err = { item, reason }
          } else {
            err = checkStr(val, item)
          }
        } else if (Array.isArray(val)) {
          if (val.length === 0) {
            err = {
              item,
              reason: item.name + '不可为空',
            }
          } else {
            for (let i = 0; i < val.length; i++) {
              const reason = item.check?.(val[i], item.name)
              if (reason) {
                err = { item, reason }
              } else {
                err = checkStr(val[i], item)
              }
            }
          }
        }
        if (err) {
          errors.push(err)
          current.showErrorText(err.reason)
        }
      })
      return errors
    },
  }
}

function checkStr<V extends string | string[]>(
  str: string,
  item: FormItem<InputComponent<V>>
): FormError<InputComponent<V>> | undefined {
  const len = str.length
  if (item.minLength && len < item.minLength) {
    return {
      item,
      reason: item.name + '不能低于' + item.minLength + '个字符',
    }
  }
  if (item.maxLength && len > item.maxLength) {
    return {
      item,
      reason: item.name + '不能超过' + item.maxLength + '个字符',
    }
  }
  return undefined
}

/**
 * @return 错误原因, 返回undefined表示内容正确
 */
type CheckFunction = (text: string, name: string) => string | undefined

/**
 * 需要注意长度包小不包大[min, maxLength)
 */
type FormItem<InputRefType> = {
  /**
   * 指向form的Input
   */
  ref: RefObject<InputRefType>
  /**
   * 当前表单名称
   */
  name: string
  /**
   * 最小长度(包括)
   */
  minLength?: number
  /**
   * 最大长度(不包括)
   */
  maxLength?: number
  /**
   * 是否允许为空
   */
  allowEmpty?: boolean
  /**
   * 自定义检查函数
   * @return 错误原因, 返回undefined表示内容正确
   */
  check?: CheckFunction
}

type CheckNumberConfig = {
  min?: number
  max?: number
  noDecimal?: boolean
}

/**
 * 检查是否为数字，并且是否在[min, max]范围内
 */
export const checkNumber =
  ({ min, max, noDecimal }: CheckNumberConfig): CheckFunction =>
  (text, name) => {
    const num = Number.parseInt(text, 10)
    if (Number.isNaN(num)) {
      return '输入的数字无效'
    }
    if (min !== undefined && num < min) {
      return name + '不可以小于' + min
    }
    if (max !== undefined && num > max) {
      return name + '不可以大于' + max
    }
    if (noDecimal) {
      for (let i = 0, len = text.length; i < len; i++) {
        if (text[i] === '.') {
          return name + '不可以包含小数'
        }
      }
    }
    return undefined
  }

type FormError<InputRefType> = {
  reason: string
  item: FormItem<InputRefType>
}
