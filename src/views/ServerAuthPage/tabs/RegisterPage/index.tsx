import React, { useRef, useState } from 'react'
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import Icons from '../../../../component/Icons'
import AniInput, { AniInputRefAttribute } from '../../AniInput'
import Button from 'react-native-button'
import { SCHOOL_AUTH } from '../../../../router'
import styles from '../../styles'
import { useNavigation } from '@react-navigation/native'
import { LOGIN_PAGE, NavigationType } from '../../index'
import Drawer from '../../../../component/Drawer'
import { checkLength, useFormChecker } from '../../../../component/Input'
import Environment from '../../../../utils/Environment'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../../../utils/LoggerUtils'
import SimpleInput from '../../../../component/Input/SimpleInput'
import {
  getRegisterInitParam,
  register,
  WtuAuthInitParam,
} from '../../../../api/server/user'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'
import Loading from '../../../../component/Loading'
import { wtuEncrypt } from '../../../../utils/aesUtils'

const logger = getLogger('/views/ServerAuthPage/tabs/RegisterPage')
const MIN_LENGTH = 8
const MAX_LENGTH = 25
const CHECK_REGX = /^[A-Za-z0-9]+$/
function isInvalidUsername(username: string): boolean {
  const match = username.match(CHECK_REGX)
  if (!match || match.length === 0) {
    return true
  }
  return match[0].length !== username.length
}

const RegisterPage: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const drawer = useRef<Drawer>(null)
  const usernameInput = useRef<AniInputRefAttribute>(null)
  const passwordInput = useRef<AniInputRefAttribute>(null)
  const passwordConfirmInput = useRef<AniInputRefAttribute>(null)
  const nav = useNavigation<NavigationType>()
  const [captchaBase64, setCaptchaBase64] = useState('')
  const [wtuUsername, setWtuUsername] = useState('')
  const [wtuPassword, setWtuPassword] = useState('')
  const [wtuCaptcha, setWtuCaptcha] = useState('')
  const wtuUsernameRef = useRef<SimpleInput>(null)
  const wtuPasswordRef = useRef<SimpleInput>(null)
  const wtuCaptchaRef = useRef<SimpleInput>(null)
  const registerParam = useRef<WtuAuthInitParam | undefined>()
  const tryReg = () => {
    if (isInvalidUsername(username)) {
      usernameInput.current?.setErrorText('用户名只能由数字或者英文字母组成')
      return
    }
    const unMsg = checkLength({
      value: username,
      name: '用户名',
      min: MIN_LENGTH,
      max: MAX_LENGTH,
    })
    if (unMsg) {
      usernameInput.current?.setErrorText(unMsg)
      return
    }
    const psMsg = checkLength({
      value: password,
      name: '密码',
      min: MIN_LENGTH,
      max: MAX_LENGTH,
    })
    if (psMsg) {
      passwordInput.current?.setErrorText(psMsg)
      return
    }
    if (password !== passwordConfirm) {
      passwordConfirmInput.current?.setErrorText('两次的密码不一致')
      return
    }
    drawer.current?.showDrawer()
  }

  const checker = useFormChecker([
    {
      name: '用户名',
      ref: wtuUsernameRef,
      minLength: 9,
      maxLength: 11,
    },
    { name: '密码', ref: wtuPasswordRef, minLength: 6, maxLength: 30 },
    { name: '验证码', ref: wtuCaptchaRef, minLength: 4, maxLength: 4 },
  ])

  const doReg = () => {
    const errors = checker.checkForm()
    if (errors.length) {
      return
    }
    const param = registerParam.current
    if (!param) {
      logger.warn('register param is null!')
      showSingleBtnTip(
        'APP出现错误',
        '这个错误是由于APP的代码逻辑造成的，你可以尝试重进APP解决。'
      )
      return
    }
    // encode
    const encodedPwd = wtuEncrypt(wtuPassword, param.salt)
    Loading.showLoading()
    register({
      wtuUsername,
      wtuPassword: encodedPwd,
      wtuCaptcha,
      registerUsername: username,
      registerPassword: password,
      cookies: param.cookies,
      lt: param.lt,
    })
      .then(r => {
        console.log(r)
        Toast.show('注册成功')
      })
      .catch(e => {
        showSingleBtnTip('注册失败', e.message)
        setCaptchaBase64('')
      })
      .finally(() => {
        Loading.hideLoading()
        drawer.current?.closeDrawer()
      })
  }

  const loadCaptcha = () => {
    Loading.showLoading()
    getRegisterInitParam(username)
      .then(r => {
        registerParam.current = r.data
        setCaptchaBase64(r.data.captcha)
      })
      .catch(e => {
        logger.error('get register init param failed: ' + e.message)
        drawer.current?.closeDrawer()
        showSingleBtnTip('加载失败', e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  const toLogin = () => {
    nav.navigate(LOGIN_PAGE)
  }

  const goSupport = () => {
    logger.info('go support')
    Linking.openURL('mailto:' + Environment.support).catch(e => {
      logger.error('go support failed: ' + e.message)
      Toast.show(
        '您的设备似乎没有邮箱应用，您可以自行使用其它应用打开邮箱并发送'
      )
    })
  }
  return (
    <View>
      <View>
        <View style={styles.header}>
          <View>
            <View style={styles.headerTextOuter}>
              <Icons iconText="&#xe656;" color="#fff" size={24} />
              <Text style={styles.headerText}>&nbsp;注册</Text>
            </View>
          </View>
          <Icons
            size={20}
            iconText="&#xe612;"
            color="#fff"
            onPress={nav.goBack}
          />
        </View>
        <View style={styles.blockOuter}>
          <AniInput
            errorColor="orange"
            placeholder="用户名"
            inputStyle={{ color: '#fff' }}
            onTextInput={setUsername}
            ref={usernameInput}
            value={username}
          />
          <AniInput
            placeholder="密码"
            errorColor="orange"
            password
            inputStyle={{ color: '#fff' }}
            onTextInput={setPassword}
            ref={passwordInput}
            value={password}
          />
          <AniInput
            placeholder="确认密码"
            errorColor="orange"
            password
            inputStyle={{ color: '#fff' }}
            onTextInput={setPasswordConfirm}
            ref={passwordConfirmInput}
            value={passwordConfirm}
          />
        </View>
        <View style={styles.blockOuter}>
          <Button
            onPress={tryReg}
            containerStyle={styles.loginBtn}
            style={{ color: '#fff', lineHeight: 50, borderRadius: 20 }}>
            注册
          </Button>
        </View>
        <Pressable style={global.styles.flexRowCenter}>
          <Text
            onPress={() => nav.navigate(SCHOOL_AUTH)}
            style={styles.linkText}>
            暂不登录，仅登录教务系统
          </Text>
        </Pressable>
        <Pressable style={global.styles.flexRowCenter}>
          <Text onPress={toLogin} style={styles.linkText}>
            已有账号？直接登录
          </Text>
        </Pressable>
      </View>
      <Drawer ref={drawer} style={inStyles.drawerContainer}>
        <View style={inStyles.drawerHeader}>
          <Text style={inStyles.drawerTitle}>需要验证</Text>
          <Text style={inStyles.submitTitle} onPress={doReg}>
            提交
          </Text>
        </View>
        <View>
          <Text>需要您的教务系统账号和密码来进行身份验证</Text>
          <Text>
            服务器<Text style={{ fontWeight: 'bold' }}>不会</Text>
            保存您的账号和密码，
            <Text style={{ color: global.colors.error_color }}>
              但是会在验证过程中从教务系统抓取你的真实姓名和班级.
            </Text>
          </Text>
          <Text>
            每个学号只能注册一个账号，如果你的学号被别人注册，你可以联系
            <Text
              onPress={goSupport}
              style={{
                textDecorationLine: 'underline',
                color: global.colors.primaryColor,
              }}>
              {Environment.support}
            </Text>
            (请留下来意和联系方式)
          </Text>
        </View>
        <View>
          <SimpleInput
            onChangeText={setWtuUsername}
            ref={wtuUsernameRef}
            textInputProps={{
              placeholder: '教务系统用户名',
              value: wtuUsername,
            }}
          />
          <SimpleInput
            ref={wtuPasswordRef}
            onChangeText={setWtuPassword}
            textInputProps={{
              placeholder: '教务系统密码',
              textContentType: 'password',
              secureTextEntry: true,
              value: wtuPassword,
            }}
          />
          <View style={inStyles.captchaContainer}>
            <SimpleInput
              ref={wtuCaptchaRef}
              style={{ flex: 1 }}
              onChangeText={setWtuCaptcha}
              textInputProps={{ placeholder: '验证码' }}
            />
            <Pressable style={inStyles.captcha} onPress={loadCaptcha}>
              {captchaBase64 ? (
                <Image
                  source={{ uri: captchaBase64 }}
                  style={inStyles.captchaImage}
                />
              ) : (
                <Text>加载验证码</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Drawer>
    </View>
  )
}

const inStyles = StyleSheet.create({
  drawerContainer: {
    padding: 15,
  },
  drawerTitle: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  submitTitle: {
    color: global.colors.primaryColor,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: global.styles.$spacing_col_base,
  },
  captchaContainer: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  captcha: {
    width: 150,
    height: 50,
    marginLeft: 20,
    justifyContent: 'center',
  },
  captchaImage: {
    width: 150,
    height: 50,
    borderWidth: 1,
  },
})

export default RegisterPage
