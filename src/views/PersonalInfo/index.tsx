import React, { useEffect, useRef } from 'react'
import { Text, View } from 'react-native'
import { getUserInfo } from '../../api/edu/applications'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import { UserInfo } from '../../redux/reducers/user'
import BasicDialog, {
  BasicDialogRefAttribute,
} from '../../component/dialogs/BasicDialog'
import { markLoginExpired, saveUserInfo } from '../../redux/actions/user'
import SimpleCard from '../../component/Cards/SimpleCard'
import styles from './styles'
import CenterTextCard from '../../component/Cards/CenterTextCard'
import { logout } from '../../api/edu/auth'
import Toast from 'react-native-toast-message'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouterTypes } from '../../router'

interface PersonalInfoProps {}

const PersonalInfo: React.FC<
  PersonalInfoProps &
    StoreProps &
    StoreActions &
    NativeStackScreenProps<RouterTypes>
> = props => {
  const dialog = useRef<BasicDialogRefAttribute>(null)
  /**
   * 加载用户信息
   */
  const checkUserInfo = () => {
    if (!props.userInfo) {
      // 加载失败了
      dialog.current?.showDialog?.({
        title: '加载资料失败',
        type: 'error',
        content: '是否重新加载',
        onConfirm() {
          getUserInfo().then(resp => {
            props.saveUserInfo(resp)
          })
        },
      })
    }
  }

  /**
   * 登出
   */
  const logOutEduAccount = (): void => {
    logout().then(() => {
      props.logOut()
      Toast.show({
        text1: '登出成功',
      })
      props.navigation.goBack()
    })
  }

  useEffect(() => {
    checkUserInfo()
  }, [])
  return (
    <View>
      <View style={styles.contentBlockHeader}>
        <Text style={styles.contentBlockHeaderText}>教务系统资料</Text>
      </View>
      <View>
        <SimpleCard
          title="用户名"
          rightContent={props.userInfo ? props.userInfo.name : '加载中'}
        />
        <SimpleCard title="学号" rightContent={props.username} />
        <SimpleCard
          title="入学日期"
          rightContent={
            props.userInfo ? props.userInfo.enrollmentDate : '加载中'
          }
        />
        <CenterTextCard
          title="注销登录"
          hideBorder
          type="error"
          onTouchEnd={logOutEduAccount}
        />
      </View>
      <BasicDialog ref={dialog} />
    </View>
  )
}

interface StoreProps {
  userInfo?: UserInfo
  username?: string
}

interface StoreActions {
  saveUserInfo: (...args: Parameters<typeof saveUserInfo>) => void
  logOut: (...args: Parameters<typeof markLoginExpired>) => void
}

export default connect<
  StoreProps,
  StoreActions,
  PersonalInfoProps,
  ReducerTypes
>(
  initialState => ({
    userInfo: initialState.user.userInfo,
    username: initialState.user.username,
  }),
  {
    saveUserInfo,
    logOut: markLoginExpired,
  }
)(PersonalInfo)
