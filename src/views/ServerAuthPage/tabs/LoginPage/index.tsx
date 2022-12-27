import React, { useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Icons from '../../../../component/Icons'
import AniInput, { AniInputRefAttribute } from '../../AniInput'
import Button from 'react-native-button'
import { SCHOOL_AUTH } from '../../../../router'
import styles from '../../styles'
import { useNavigation } from '@react-navigation/native'
import { NavigationType, REGISTER_PAGE } from '../../index'
import useFormManager from '../../../../hook/useFormManager'
import { login } from '../../../../api/server/auth'
import { useDispatch, useStore } from 'react-redux'
import { markLogin } from '../../../../redux/counter/serverUserSlice'
import { getLogger } from '../../../../utils/LoggerUtils'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'
import Loading from '../../../../component/Loading'
import Toast from 'react-native-toast-message'
import AppEvents from '../../../../AppEvents'
import { ReducerTypes } from '../../../../redux/counter'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'

const logger = getLogger('views/ServerAuthPage/tabs/LoginPage')

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const usernameInput = useRef<AniInputRefAttribute>(null)
  const passwordInput = useRef<AniInputRefAttribute>(null)
  const nav = useNavigation<NavigationType>()
  const dispatch = useDispatch()
  const store = useStore<ReducerTypes>()
  const formManager = useFormManager<React.RefObject<AniInputRefAttribute>>({
    formItems: [
      {
        name: '用户名',
        ref: usernameInput,
        value: username,
        maxLength: 26,
        minLength: 6,
      },
      {
        name: '密码',
        ref: passwordInput,
        value: password,
        maxLength: 26,
        minLength: 6,
      },
    ],
  })

  const tryLogin = () => {
    const errors = formManager.checkForm()
    if (errors.length > 0) {
      errors.forEach(value => {
        value.item.ref.current?.setErrorText(value.reason)
      })
      return
    }
    logger.debug(`form is valid, username ${username} password: ${password}`)
    Loading.showLoading()
    login(username, password)
      .then(({ data }) => {
        logger.debug('login to server success, userid: ' + data)
        const userInfo: ServerUserInfo = {
          uid: data.userId,
          nickname: data.nickname,
          username: '',
          name: data.name,
          className: data.className,
          email: data.email,
          wtuId: data.wtuId,
        }
        AppEvents.trigger('onLoginDone', {
          previousUserInfo: store.getState().serverUser.userInfo,
          currentUserInfo: userInfo,
        })
        dispatch(markLogin(userInfo))
        Toast.show({
          text1: '登录成功',
          text2: '感谢您使用本APP',
          type: 'success',
        })
        nav.goBack()
      })
      .catch(e => {
        showSingleBtnTip('登录失败', e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  const toRegister = () => {
    nav.navigate(REGISTER_PAGE)
  }

  return (
    <React.Fragment>
      <View style={styles.header}>
        <View>
          <View style={styles.headerTextOuter}>
            <Icons iconText="&#xe656;" color="#fff" size={24} />
            <Text style={styles.headerText}>&nbsp;登录</Text>
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
          placeholder="用户名"
          inputStyle={{ color: '#fff' }}
          onTextInput={setUsername}
          ref={usernameInput}
          value={username}
        />
        <AniInput
          placeholder="密码"
          password
          inputStyle={{ color: '#fff' }}
          onTextInput={setPassword}
          ref={passwordInput}
          value={password}
        />
      </View>
      <View style={styles.blockOuter}>
        <Button
          onPress={tryLogin}
          containerStyle={styles.loginBtn}
          style={{ color: '#fff', lineHeight: 50, borderRadius: 20 }}>
          登录
        </Button>
      </View>
      <Pressable style={global.styles.flexRowCenter}>
        <Text onPress={() => nav.navigate(SCHOOL_AUTH)} style={styles.linkText}>
          暂不登录，仅登录教务系统
        </Text>
      </Pressable>
      <Pressable style={global.styles.flexRowCenter}>
        <Text onPress={toRegister} style={styles.linkText}>
          没有账号，需要注册?
        </Text>
      </Pressable>
    </React.Fragment>
  )
}

export default LoginPage
