import React, { useEffect } from 'react'
import NativeDialog from '../../native/modules/NativeDialog'
import { StackActions, useNavigation } from '@react-navigation/native'
import { EduAuthPage } from '../Webpage'
import { UseNavigationGeneric, WEB_PAGE } from '../../router'

/*
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
*/

/*const SchoolAuth: React.FC<SchoolAuthProps> = props => {
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
        NativeDialog.showDialog({
          title: '登录失败',
          message: `${e.toString()}, 是否重新登录?`,
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
    // 隐藏键盘
    Keyboard.dismiss()
    if (!loginParam) {
      NativeDialog.showDialog({
        title: '初始化失败',
        message: '初始化参数失败, 是否需要重新加载',
        onConfirm() {
          tryInit()
        },
      })
      return
    }
    // tryLogin
    Loading.showLoading()
    const pwd = wtuEncrypt(password, loginParam.encryptSalt)
    login(loginParam.lt, pwd, captcha, username, loginParam.execution)
      .then(status => {
        props.saveUserCredentials(username, password)
        if (status.isSuccess) {
          Toast.show({
            text1: status.message,
          })
          props.markLogin()
          props.navigation.goBack()
        } else {
          NativeDialog.showDialog({
            title: '登录失败',
            message: status.message,
            hideCancelBtn: true,
            onConfirm() {
              tryInit()
            },
            type: 'error',
          })
        }
      })
      .finally(() => {
        Loading.hideLoading()
      })
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
      {/!* Header *!/}
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
              value={captcha}
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
}*/

/*export default connect<StoreProps, StoreActions, SchoolAuthProps, ReducerTypes>(
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
)(SchoolAuth)*/

/**
 * 自定义的登录界面有莫名的bug, 不想修了= =+
 * @constructor
 * @deprecated 使用WebView直接转跳
 */
const SchoolAuth: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  useEffect(() => {
    NativeDialog.showDialog({
      title: '请在接下来的页面登录',
      message: '登录完毕后直接退出即可',
      hideCancelBtn: true,
      onConfirm: () => {
        nav.dispatch(StackActions.replace(WEB_PAGE, { url: EduAuthPage }))
      },
    })
  }, [])
  return null
}
export default SchoolAuth
