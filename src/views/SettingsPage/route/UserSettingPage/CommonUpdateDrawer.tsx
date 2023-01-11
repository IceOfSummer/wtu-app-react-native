import React from 'react'
import Drawer from '../../../../component/Drawer'
import DrawerCommonContainer from '../../../../component/Drawer/DrawerCommonContainer'
import SimpleInput from '../../../../component/Input/SimpleInput'
import { updateUserInfo, UserUpdate } from '../../../../api/server/user'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../../../utils/LoggerUtils'
import Loading from '../../../../component/Loading'
import { store } from '../../../../redux/store'
import { updateServerUserInfo } from '../../../../redux/counter/serverUserSlice'

const logger = getLogger(
  '/views/SettingsPage/route/UserSettingPage/CommonUpdateDrawer'
)

interface CommonUpdateDrawerProps {
  name: string
  originValue?: string
  updateProperty: keyof UserUpdate
}

interface CommonUpdateDrawerState {
  text: string
}

export default class CommonUpdateDrawer extends React.Component<
  CommonUpdateDrawerProps,
  CommonUpdateDrawerState
> {
  state: CommonUpdateDrawerState = {
    text: '',
  }

  drawer = React.createRef<Drawer>()

  input = React.createRef<SimpleInput>()

  maxSize: number | undefined

  public showDrawer(maxSize?: number) {
    this.maxSize = maxSize
    this.drawer.current?.showDrawer()
  }

  onSubmit() {
    if (this.props.originValue && this.props.originValue === this.state.text) {
      logger.info('new value is equals to the old, skip update')
      this.drawer.current?.closeDrawer()
      return
    }
    if (this.state.text.length === 0) {
      this.input.current?.showErrorText('请至少输入一个字符')
      return
    }
    if (this.maxSize && this.state.text.length >= this.maxSize) {
      this.input.current?.showErrorText(`长度不可以超过${this.maxSize}`)
      return
    }
    logger.info(
      `update '${this.props.updateProperty}', value: '${this.state.text}'`
    )
    Loading.showLoading()
    updateUserInfo({
      [this.props.updateProperty]: this.state.text,
    })
      .then(() => {
        logger.info('update userInfo success')
        Toast.show('修改成功')
        store.dispatch(
          updateServerUserInfo({
            [this.props.updateProperty]: this.state.text,
          })
        )
      })
      .catch(e => {
        logger.error('update failed: ' + e.message)
        Toast.show('修改失败: ' + e.message)
      })
      .finally(() => {
        Loading.hideLoading()
        this.drawer.current?.closeDrawer()
      })
  }

  onChangeText(text: string) {
    this.setState({ text })
  }

  constructor(props: CommonUpdateDrawerProps) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.state.text = props.originValue ?? ''
  }

  render() {
    return (
      <Drawer ref={this.drawer}>
        <DrawerCommonContainer
          title={'修改' + this.props.name}
          onSubmit={this.onSubmit}>
          <SimpleInput
            ref={this.input}
            onChangeText={this.onChangeText}
            textInputProps={{
              placeholder: '修改' + this.props.name,
              value: this.state.text,
            }}
          />
        </DrawerCommonContainer>
      </Drawer>
    )
  }
}
