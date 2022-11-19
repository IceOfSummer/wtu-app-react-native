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

interface SimpleInputProps {
  textInputProps?: TextInputProps
  rowTipText?: string
  rowTipTextStyle?: TextStyle
}

interface SimpleInputState {
  errorText: string
  placeholderColor?: ColorValue
}

/**
 * 简单的输入框
 *
 * 可以传入children在分割线的上方渲染其它内容
 */
export default class SimpleInput extends React.Component<
  SimpleInputProps,
  SimpleInputState
> {
  state = {
    errorText: '',
    placeholderColor: undefined,
  }

  input = React.createRef<TextInput>()

  divider = React.createRef<AnimatedDivider>()

  public showErrorText(errorText: string) {
    this.setState({
      errorText,
    })
  }

  public removeErrorText() {
    this.setState({
      errorText: '',
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

  constructor(props: SimpleInputProps) {
    super(props)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
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
        <AnimatedDivider ref={this.divider} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  errorText: {
    color: global.colors.error_color,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
  },
})
