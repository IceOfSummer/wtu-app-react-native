import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouterTypes } from '../../router'
import {
  markLogin,
  markLoginExpired,
  saveUserCredentials,
} from '../../redux/actions/user'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import Icons from '../../component/Icons'
import styles from './styles'
import AniInput, { AniInputRefAttribute } from './AniInput'
import { initLogin, InitLoginResponse, login } from '../../api/edu/auth'
import Button from 'react-native-button'
import BasicDialog, {
  BasicDialogRefAttribute,
} from '../../component/dialogs/BasicDialog'
import { wtuEncrypt } from '../../utils/aesUtils'
import Toast from 'react-native-toast-message'

interface StoreProps {
  username?: string
  password?: string
  expired: boolean
}

interface StoreActions {
  saveUserCredentials: (...args: Parameters<typeof saveUserCredentials>) => void
  markLogin: (...args: Parameters<typeof markLogin>) => void
  markLoginExpired: (...args: Parameters<typeof markLoginExpired>) => void
}

type SchoolAuthProps = NativeStackScreenProps<RouterTypes> &
  StoreProps &
  StoreActions

const SchoolAuth: React.FC<SchoolAuthProps> = props => {
  const [captcha, setCaptcha] = useState<string>('')
  const [password, setPassword] = useState<string>(
    props.password ? props.password : ''
  )
  const [username, setUsername] = useState<string>(
    props.username ? props.username : ''
  )
  const [loginParam, setLoginParam] = useState<InitLoginResponse>(null)
  const usernameInput = useRef<AniInputRefAttribute>(null)
  const passwordInput = useRef<AniInputRefAttribute>(null)
  const captchaInput = useRef<AniInputRefAttribute>(null)
  const dialog = useRef<BasicDialogRefAttribute>(null)

  // 初始化loginParam
  const tryInit = () => {
    initLogin()
      .then(data => {
        if (!data) {
          // 已经登录
          props.markLogin()
          Toast.show({
            text1: '已经自动重新登录了!',
          })
          props.navigation.goBack()
          return
        }
        props.markLoginExpired()
        // 需要重新登录
        setLoginParam(data)
        loadCaptcha()
      })
      .catch(e => {
        dialog.current?.showDialog({
          title: '登录失败, 是否重新登录',
          content: e.toString(),
          type: 'error',
          onConfirm() {
            tryInit()
          },
        })
      })
  }

  const CAPTCHA_URL = 'https://auth.wtu.edu.cn/authserver/captcha.html?ts=233'
  const [captchaUrl, setCaptchaUrl] = useState<string | undefined>()
  // 加载验证码
  const loadCaptcha = () => {
    setCaptchaUrl(`${CAPTCHA_URL}?ts=${Math.ceil(Math.random() * 300)}`)
  }

  const tryLogin = () => {
    if (isInvalidForm()) {
      return
    }
    if (!loginParam) {
      dialog.current?.showDialog?.({
        title: '初始化失败',
        content: '初始化参数失败, 是否需要重新登录',
        type: 'error',
      })
      return
    }
    // tryLogin
    const pwd = wtuEncrypt(password, loginParam.encryptSalt)
    login(loginParam.lt, pwd, captcha, username, loginParam.execution).then(
      resp => {
        props.saveUserCredentials(username, password)
        const match = resp.match(/<span id="msg" class="auth_error".+</)
        if (match == null) {
          // success
          Toast.show({
            text1: '登录成功!',
          })
          props.markLogin()
          props.navigation.goBack()
        } else {
          let errMsg = match[0].replace(/<.+>/, '').replace('<', '')
          dialog.current?.showDialog?.({
            title: '登录失败',
            content: errMsg,
            hideCancel: true,
            onConfirm() {
              tryInit()
            },
            type: 'error',
          })
        }
      }
    )
  }

  function isInvalidForm() {
    let status = false
    if (username.length === 0) {
      usernameInput.current?.setErrorText('用户名不可为空')
      status = true
    }
    if (password.length === 0) {
      passwordInput.current?.setErrorText('密码不可为空')
      status = true
    }
    if (captcha.length === 0) {
      captchaInput.current?.setErrorText('验证码不可为空')
      status = true
    }
    return status
  }

  useEffect(() => {
    tryInit()
  }, [])

  return (
    <View>
      {/* Dialog */}
      <BasicDialog ref={dialog} />
      {/* Header */}
      <View style={styles.closeBtn}>
        <Icons
          size={20}
          iconText="&#xe612;"
          color="#000"
          onPress={() => props.navigation.goBack()}
        />
      </View>
      <View>
        <View style={styles.headerTextOuter}>
          <Icons iconText="&#xe656;" style={styles.headerText} />
          <Text style={styles.headerText}>登录教务系统</Text>
        </View>
      </View>
      <View style={styles.blockOuter}>
        <AniInput
          placeholder="用户名"
          onTextInput={setUsername}
          ref={usernameInput}
          value={username}
        />
        <AniInput
          placeholder="密码"
          password
          onTextInput={setPassword}
          ref={passwordInput}
          value={password}
        />
        <View style={styles.captchaInputBlock}>
          <View style={styles.captchaInput}>
            <AniInput
              placeholder="验证码"
              onTextInput={setCaptcha}
              ref={captchaInput}
            />
          </View>
          <View style={styles.captchaImage} onTouchStart={loadCaptcha}>
            <Image source={{ uri: captchaUrl }} style={styles.captchaImage} />
          </View>
        </View>
      </View>
      <View style={styles.blockOuter}>
        <Button
          onPress={tryLogin}
          containerStyle={styles.loginBtn}
          style={{ color: '#fff', lineHeight: 50, borderRadius: 20 }}>
          登录
        </Button>
      </View>
    </View>
  )
}

export default connect<StoreProps, StoreActions, SchoolAuthProps, ReducerTypes>(
  initialState => ({
    username: initialState.user.username,
    password: initialState.user.password,
    expired: !initialState.user.isLoginValid,
  }),
  {
    saveUserCredentials,
    markLogin,
    markLoginExpired,
  }
)(SchoolAuth)
