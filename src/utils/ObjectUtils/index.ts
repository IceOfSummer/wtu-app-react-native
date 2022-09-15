/**
 * 深拷贝对象
 * @param src 目标对象
 */
export const deepCopyObject = <T>(src: T): T => {
  return JSON.parse(JSON.stringify(src))
}

/**
 * 检查该值是否为null, 若为null则抛出异常
 */
export const nonNull = <T>(val: T | undefined): NonNullable<T> => {
  if (val) {
    return val!
  } else {
    throw new Error()
  }
}

/**
 * 比较对象往内的一层属性，并将其合并
 *
 * 例如:
 * {
 *   hello: {
 *     text1: 'msg1'
 *   }
 * }
 * {
 *   hello: {
 *     text2: 'msg2'
 *   }
 * }
 * 合并后为:
 * {
 *   hello: {
 *     text1: 'msg1',
 *     text2: 'msg2'
 *   }
 * }
 * @param src
 * @param source
 */
export const innerCombineObject = <T extends Record<string, any>>(
  src: T,
  source: any
): T => {
  Object.keys(source).forEach(key => {
    if (!source[key]) {
      // @ts-ignore
      src[key] = null
    } else if (src[key]) {
      // @ts-ignore
      src[key] = Object.assign(src[key], source[key])
    } else {
      // @ts-ignore
      src[key] = source[key]
    }
  })
  return src
}

/**
 * 用来消除React组件使用defaultProps + ts 的报错
 * 使用方法:<p/>
 * <code>
 *   const defaultProps = {
 *     triggerBottomDis: 30,
 *   }
 *   const getProps = createPropsGetter(defaultProps)
 *
 *   // ...
 *   const {triggerBottomDis} = getProps(this.props)
 * </code>
 * @param defaultProps
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createPropsGetter = <DP extends object>(defaultProps: DP) => {
  return <P extends Partial<DP>>(props: P) => {
    type PropsExcludingDefaults = Pick<P, Exclude<keyof P, keyof DP>>
    type RecomposedProps = DP & PropsExcludingDefaults
    return props as any as RecomposedProps
  }
}
