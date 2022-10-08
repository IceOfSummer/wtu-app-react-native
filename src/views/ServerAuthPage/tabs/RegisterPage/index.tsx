import React, { useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Icons from '../../../../component/Icons'
import AniInput, { AniInputRefAttribute } from '../../AniInput'
import Button from 'react-native-button'
import { SCHOOL_AUTH } from '../../../../router'
import styles from '../../styles'
import { useNavigation } from '@react-navigation/native'
import { LOGIN_PAGE, NavigationType } from '../../index'

const RegisterPage: React.FC = () => {
  const [captcha, setCaptcha] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const usernameInput = useRef<AniInputRefAttribute>(null)
  const passwordInput = useRef<AniInputRefAttribute>(null)
  const captchaInput = useRef<AniInputRefAttribute>(null)
  const nav = useNavigation<NavigationType>()

  const tryLogin = () => {
    // TODO
  }

  const toLogin = () => {
    nav.navigate(LOGIN_PAGE)
  }

  return (
    <React.Fragment>
      <View style={styles.header}>
        <View>
          <View style={styles.headerTextOuter}>
            <Icons iconText="&#xe656;" color="#fff" size={20} />
            <Text style={styles.headerText}>注册</Text>
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
          <View style={styles.captchaImage}>
            {/*<Image source={{ uri: captchaUrl }} style={styles.captchaImage} />*/}
            <View style={[styles.captchaImage, { backgroundColor: 'skyblue' }]}>
              <Text>验证码</Text>
            </View>
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
      <Pressable style={global.styles.flexRowCenter}>
        <Text onPress={() => nav.navigate(SCHOOL_AUTH)} style={styles.linkText}>
          暂不登录，仅登录教务系统
        </Text>
      </Pressable>
      <Pressable style={global.styles.flexRowCenter}>
        <Text onPress={toLogin} style={styles.linkText}>
          已有账号？直接登录
        </Text>
      </Pressable>
    </React.Fragment>
  )
}

export default RegisterPage
