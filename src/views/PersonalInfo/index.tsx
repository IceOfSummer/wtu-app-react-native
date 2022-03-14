import React, { useEffect, useRef } from 'react'
import { Text, View } from 'react-native'
import { getUserInfo } from '../../api/edu/applications'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import { UserInfo } from '../../redux/reducers/user'
import BasicDialog, {
  BasicDialogRefAttribute,
} from '../../component/dialogs/BasicDialog'
import { saveUserInfo } from '../../redux/actions/user'

interface PersonalInfoProps {}

const PersonalInfo: React.FC<
  PersonalInfoProps & StoreProps & StoreActions
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

  useEffect(() => {
    checkUserInfo()
  }, [])
  return (
    <View>
      <View>
        {props.userInfo ? (
          <Text>{props.userInfo.name}</Text>
        ) : (
          <Text>加载中</Text>
        )}
      </View>
      <BasicDialog ref={dialog} />
    </View>
  )
}

interface StoreProps {
  userInfo?: UserInfo
}

interface StoreActions {
  saveUserInfo: (...args: Parameters<typeof saveUserInfo>) => void
}

export default connect<
  StoreProps,
  StoreActions,
  PersonalInfoProps,
  ReducerTypes
>(
  initialState => ({
    userInfo: initialState.user.userInfo,
  }),
  {
    saveUserInfo,
  }
)(PersonalInfo)
