import React from 'react'
import Drawer from '../../../../component/Drawer'
import DrawerCommonContainer from '../../../../component/Drawer/DrawerCommonContainer'
import { StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../../../component/Input/SimpleInput'
import {
  requireEmailUpdateCaptcha,
  updateEmail,
} from '../../../../api/server/user'
import Toast from 'react-native-root-toast'
import Loading from '../../../../component/Loading'
import { store } from '../../../../redux/store'
import { updateServerUserInfo } from '../../../../redux/counter/serverUserSlice'

interface EmailUpdateDrawerProps {
  originValue?: string
}

interface EmailUpdateDrawerState {
  email: string
  captcha: string
  emailLock: number
}

/**
 * 邮箱检查正则表达式
 */
const EMAIL_CHECK_REGX = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

export default class EmailUpdateDrawer extends React.Component<
  EmailUpdateDrawerProps,
  EmailUpdateDrawerState
> {
  drawer = React.createRef<Drawer>()

  emailInput = React.createRef<SimpleInput>()

  captchaInput = React.createRef<SimpleInput>()

  public showDrawer() {
    this.drawer.current?.showDrawer()
  }

  onEmailTextChange(text: string) {
    this.setState({
      email: text,
    })
  }

  onCaptchaTextChange(text: string) {
    this.setState({
      captcha: text,
    })
  }

  requireCaptcha() {
    if (this.state.emailLock > 0) {
      return
    }
    if (!EMAIL_CHECK_REGX.test(this.state.email)) {
      this.emailInput.current?.showErrorText('邮箱的格式不正确!')
      return
    }
    const drawer = this.drawer.current
    if (!drawer) {
      return
    }
    Loading.showLoading()
    requireEmailUpdateCaptcha(this.state.email)
      .then(() => {
        this.lockCaptcha()
        drawer.showToast('邮件已经发送, 请注意查收')
      })
      .catch(e => {
        drawer.showToast('发送失败: ' + e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  lockCaptcha() {
    this.setState({
      emailLock: 30,
    })
    setInterval(() => {
      this.setState({
        emailLock: this.state.emailLock - 1,
      })
    }, 1000)
  }

  onSubmit() {
    const { captcha } = this.state
    if (captcha.length <= 4) {
      this.captchaInput.current?.showErrorText('请输入有效的验证码')
      return
    }
    Loading.showLoading()
    updateEmail(captcha)
      .then(() => {
        Toast.show('修改邮箱成功')
        store.dispatch(
          updateServerUserInfo({
            email: this.state.email,
          })
        )
      })
      .catch(e => {
        Toast.show('修改邮箱失败: ' + e.message)
      })
      .finally(() => {
        Loading.hideLoading()
        this.drawer.current?.closeDrawer()
      })
  }

  constructor(props: EmailUpdateDrawerProps) {
    super(props)
    this.state = { email: props.originValue ?? '', captcha: '', emailLock: 0 }
    this.onEmailTextChange = this.onEmailTextChange.bind(this)
    this.onCaptchaTextChange = this.onCaptchaTextChange.bind(this)
    this.requireCaptcha = this.requireCaptcha.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    return (
      <Drawer ref={this.drawer}>
        <DrawerCommonContainer title="修改邮箱" onSubmit={this.onSubmit}>
          <SimpleInput
            onChangeText={this.onEmailTextChange}
            ref={this.emailInput}
            textInputProps={{
              value: this.state.email,
              textContentType: 'emailAddress',
              placeholder: '输入邮箱',
            }}
          />
          <View style={global.styles.flexRowJustBetween}>
            <SimpleInput
              ref={this.captchaInput}
              style={styles.captchaInput}
              onChangeText={this.onCaptchaTextChange}
              textInputProps={{ placeholder: '验证码' }}
            />
            <Text
              style={[
                styles.captchaRequireText,
                {
                  color:
                    this.state.emailLock === 0
                      ? global.colors.textColor
                      : undefined,
                },
              ]}
              onPress={this.requireCaptcha}>
              获取验证码
              {this.state.emailLock > 0 ? `(${this.state.emailLock}秒)` : ''}
            </Text>
          </View>
          <Text style={global.styles.infoTipText}>
            提示: 您每月只能获取3次验证码, 请仔细检查邮箱是否填写正确!
          </Text>
        </DrawerCommonContainer>
      </Drawer>
    )
  }
}

const styles = StyleSheet.create({
  captchaInput: {
    flex: 1,
  },
  captchaRequireText: {
    marginHorizontal: 10,
  },
})
