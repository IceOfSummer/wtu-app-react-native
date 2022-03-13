import React, {
  ForwardedRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { View, TextInput, Animated } from 'react-native'

interface AniInputProps {
  placeholder?: string
  password?: boolean
  onTextInput?: (text: string) => void
  value?: string
}
interface AniInputRefProps {
  onRef?: ForwardedRef<any>
}

export type AniInputRefAttribute = {
  setErrorText: (text: string) => void
}

const AniInput: React.FC<AniInputProps & AniInputRefProps> = props => {
  // 错误信息
  const [placeholder, setPlaceholder] = useState(
    props.placeholder ? props.placeholder : ''
  )
  const [isError, setErrorStatus] = useState(false)
  // 记录text
  const [text, setText] = useState<string>(props.value ? props.value : '')
  const inputEvent = (t: string): void => {
    setText(t)
    setErrorStatus(false)
    setPlaceholder(props.placeholder ? props.placeholder : '')
    props.onTextInput?.(t)
  }

  // 动画
  const scaleFont = useRef(
    new Animated.Value(global.styles.$font_size_base)
  ).current
  const moveText = useRef(new Animated.Value(30)).current
  const DURATION = 100

  const startAniObj = Animated.parallel([
    Animated.timing(scaleFont, {
      toValue: global.styles.$font_size_sm,
      useNativeDriver: false,
      duration: DURATION,
    }),
    Animated.timing(moveText, {
      toValue: 10,
      useNativeDriver: false,
      duration: DURATION,
    }),
  ])

  const stopAniObj = Animated.parallel([
    Animated.timing(scaleFont, {
      toValue: global.styles.$font_size_base,
      useNativeDriver: false,
      duration: DURATION,
    }),
    Animated.timing(moveText, {
      toValue: 30,
      useNativeDriver: false,
      duration: DURATION,
    }),
  ])

  const startAnimation = () => {
    stopAniObj.stop()
    startAniObj.start()
  }

  const resetAnimation = () => {
    if (text && text.length !== 0) {
      // 有内容了 不重置
      return
    }
    stopAniObj.stop()
    stopAniObj.start()
  }

  // 设置错误文字
  const setErrorText = (msg: string): void => {
    setPlaceholder(`${props.placeholder}(${msg})`)
    setErrorStatus(true)
  }
  useImperativeHandle(props.onRef, () => ({ setErrorText }))

  return (
    <View
      style={{
        borderBottomWidth: 0.5,
        borderColor: global.styles.$border_color,
        marginTop: 10,
      }}>
      <View style={{ alignItems: 'flex-start', height: 30 }}>
        <Animated.Text
          style={{
            transform: [{ translateY: moveText }],
            color: isError
              ? global.styles.$error_color
              : global.styles.$text_color,
            marginLeft: 2,
            paddingBottom: 2,
            fontSize: scaleFont,
          }}>
          {placeholder}
        </Animated.Text>
      </View>
      <TextInput
        secureTextEntry={props.password}
        onFocus={startAnimation}
        onBlur={resetAnimation}
        style={{ margin: 2, padding: 0 }}
        onChangeText={inputEvent}
      />
    </View>
  )
}

export default React.forwardRef<AniInputRefAttribute, AniInputProps>(
  (props, ref) => {
    return <AniInput {...props} onRef={ref} />
  }
)
