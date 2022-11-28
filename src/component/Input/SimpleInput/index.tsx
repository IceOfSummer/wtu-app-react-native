import React from 'react'
import {
  ColorValue,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native'
import AnimatedDivider from '../../Container/AnimatedDivider'
import { InputComponent } from '../index'

interface SimpleInputProps {
  textInputProps?: TextInputProps
  rowTipText?: string
  rowTipTextStyle?: TextStyle
  autoClearErrorText?: boolean
  onChangeText?: (text: string) => void
}

interface SimpleInputState {
  errorText: string
  placeholderColor?: ColorValue
}

/**
 * 简单的输入框
 * <p>
 * 可以传入children在分割线的上方渲染其它内容, 部分input事件，如onChangeText需要直接绑定在组件上
 */
export default class SimpleInput
  extends React.Component<SimpleInputProps, SimpleInputState>
  implements InputComponent<string>
{
  state = {
    errorText: '',
    placeholderColor: undefined,
    rowTipTextStyle: global.styles.textContent,
  }

  _value = ''

  input = React.createRef<TextInput>()

  divider = React.createRef<AnimatedDivider>()

  static defaultProps = {
    autoClearErrorText: true,
  }

  public showErrorText(errorText: string) {
    console.log(errorText)
    this.setState({
      errorText,
    })
  }

  onFocus() {
    this.divider.current?.active()
    this.setState({ placeholderColor: global.colors.primaryColor })
  }

  onBlur() {
    this.divider.current?.blur()
    this.setState({ placeholderColor: undefined })
  }

  onChangeText(text: string) {
    this._value = text
    this.props.onChangeText?.(text)
    if (this.props.autoClearErrorText) {
      this.clearErrorText()
    }
  }

  public clearErrorText(): void {
    this.setState({
      errorText: '',
    })
  }

  public value(): string {
    return this._value
  }

  constructor(props: SimpleInputProps) {
    super(props)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
  }

  render() {
    const { textInputProps, rowTipText, rowTipTextStyle } = this.props
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: rowTipText ? 'flex-start' : 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            {...textInputProps}
            style={{ flex: 1 }}
            ref={this.input}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChangeText={this.onChangeText}
            placeholderTextColor={this.state.placeholderColor}
          />
          {rowTipText ? (
            <Text style={rowTipTextStyle}>{rowTipText}</Text>
          ) : null}
        </View>
        <View>{this.props.children}</View>
        {this.state.errorText ? (
          <Text style={styles.errorText}>{this.state.errorText}</Text>
        ) : null}
        <AnimatedDivider
          ref={this.divider}
          color={
            this.state.errorText
              ? global.colors.error_color
              : global.colors.primaryColor
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  errorText: {
    color: global.colors.error_color,
    marginLeft: 4,
    marginBottom: 4,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
  },
})
