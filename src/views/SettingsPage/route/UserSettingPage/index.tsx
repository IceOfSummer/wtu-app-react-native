import React, { useRef, useState } from 'react'
import { useSelector, useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { StyleSheet, View } from 'react-native'
import CardContainer from '../../../../component/Cards/CardContainer'
import CenterTextCard from '../../../../component/Cards/CenterTextCard'
import { markLoginInvalid } from '../../../../redux/counter/serverUserSlice'
import NativeDialog from '../../../../native/modules/NativeDialog'
import { useNavigation } from '@react-navigation/native'
import { getLogger } from '../../../../utils/LoggerUtils'
import KVTextCard from '../../../../component/Cards/KVTextCard'
import EmailUpdateDrawer from './EmailUpdateDrawer'
import CommonUpdateDrawer from './CommonUpdateDrawer'
import { UserUpdate } from '../../../../api/server/user'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'
import NavigationCard from '../../../../component/Cards/NavigationCard'
import ImagePickMenu, {
  ImageProperty,
} from '../../../../component/Drawer/BottomMenu/ImagePickMenu'
import {
  requireAvatarUploadSign,
  uploadAvatar,
} from '../../../../api/server/cos'
import Loading from '../../../../component/Loading'
import Toast from 'react-native-root-toast'

const logger = getLogger('/views/SettingsPage/route/UserSettingPage')

enum OP {
  UPDATE_NICKNAME,
}
const PROPERTY_MAP: Array<keyof UserUpdate> = ['nickname']
const NAME_MAP: Array<string> = ['昵称']
const MAX_SIZE_MAP: Array<number> = [20]

const UserSettingPage: React.FC = () => {
  const store = useStore<ReducerTypes>()
  const info = useSelector<ReducerTypes, ServerUserInfo | undefined>(
    state => state.serverUser.userInfo
  )
  const nav = useNavigation()
  const [currentOp, setCurrentOp] = useState(OP.UPDATE_NICKNAME)
  const commonUpdateDrawer = useRef<CommonUpdateDrawer>(null)
  const emailUpdateDrawer = useRef<EmailUpdateDrawer>(null)
  const imagePickMenu = useRef<ImagePickMenu>(null)

  const openUpdateDrawer = (op: OP) => {
    setCurrentOp(op)
    commonUpdateDrawer.current?.showDrawer(MAX_SIZE_MAP[op])
  }

  const openEmailUpdateDrawer = () => {
    emailUpdateDrawer.current?.showDrawer()
  }

  const logout = () => {
    NativeDialog.showDialog({
      title: '注销登录',
      message: '确定注销吗?',
      onConfirm() {
        store.dispatch(markLoginInvalid())
        nav.goBack()
      },
    })
  }

  const changeAvatar = () => {
    imagePickMenu.current?.showDrawer()
  }

  const onAvatarSelect = async (paths: ImageProperty[]) => {
    const img = paths[0]
    logger.info('select avatar: ')
    logger.info(img)
    Loading.showLoading()
    try {
      const { data } = await requireAvatarUploadSign(img.descriptor)
      await uploadAvatar(info!.uid, data, img.contentType, img.path)
      Toast.show('头像上传成功，可能需要一段时间才能正常显示')
    } catch (e: any) {
      logger.error('upload avatar failed: ' + e.message)
      Toast.show('上传失败: ' + e.message)
    } finally {
      Loading.hideLoading()
    }
  }

  if (!info) {
    return null
  }
  return (
    <View>
      <CardContainer style={styles.container}>
        <NavigationCard title="更换头像" onTap={changeAvatar} />
        <KVTextCard
          title="昵称"
          value={info.nickname}
          showArrow
          onTap={() => openUpdateDrawer(OP.UPDATE_NICKNAME)}
        />
        <KVTextCard
          title="邮箱"
          onTap={openEmailUpdateDrawer}
          value={info.email ?? '待绑定'}
          showArrow
          hideBorder
        />
      </CardContainer>
      <CardContainer>
        <KVTextCard title="学号" value={info.wtuId} />
        <KVTextCard title="真实姓名" value={info.name} />
        <KVTextCard title="班级" value={info.className} />
        <KVTextCard title="学院" value={info.academy} hideBorder />
      </CardContainer>
      <CardContainer>
        <CenterTextCard
          title="退出登录"
          type="error"
          hideBorder
          onTap={logout}
        />
      </CardContainer>
      {/*目前只能更新昵称，所以用硬编码*/}
      <CommonUpdateDrawer
        ref={commonUpdateDrawer}
        name={NAME_MAP[currentOp]}
        updateProperty={PROPERTY_MAP[currentOp]}
        originValue={info[PROPERTY_MAP[currentOp]]}
      />
      <EmailUpdateDrawer ref={emailUpdateDrawer} originValue={info.email} />
      <ImagePickMenu ref={imagePickMenu} onSelect={onAvatarSelect} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  imageBackground: {
    width: '100%',
    height: 300,
    position: 'absolute',
    top: 0,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  userInfoContainer: {
    marginLeft: 6,
  },
  nicknameText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_lg,
  },
})

export default UserSettingPage
