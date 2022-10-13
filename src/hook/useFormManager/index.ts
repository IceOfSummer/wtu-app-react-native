/**
 * 统一管理form
 * @param config 配置
 */
const useFormManager = <InputRefType>(
  config: FormManagerCons<InputRefType>
) => {
  return {
    checkForm(): Array<FormError<InputRefType>> {
      const errors: Array<FormError<InputRefType>> = []
      config.formItems.forEach(item => {
        const val = item.value.trim()
        if (val) {
          const len = val.length
          if (item.minLength && len < item.minLength) {
            errors.push({
              item,
              reason: item.name + '不能低于' + item.minLength + '个字符',
            })
            return
          }
          if (item.maxLength && len > item.maxLength) {
            errors.push({
              item,
              reason: item.name + '不能超过' + item.maxLength + '个字符',
            })
          }
        } else if (!item.allowEmpty) {
          errors.push({
            item,
            reason: item.name + '不可为空',
          })
        }
      })
      return errors
    },
  }
}

type FormManagerCons<InputRefType> = {
  formItems: Array<FormItem<InputRefType>>
}

/**
 * 需要注意长度包小不包大[min, maxLength)
 */
type FormItem<InputRefType> = {
  /**
   * 指向form的Input
   */
  ref: InputRefType
  /**
   * 当前表单的值
   */
  value: string
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
  allowEmpty?: boolean
}

type FormError<InputRefType> = {
  reason: string
  item: FormItem<InputRefType>
}

export default useFormManager
