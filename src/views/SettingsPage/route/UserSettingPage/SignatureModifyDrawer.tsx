import React from 'react'
import Drawer from '../../../../component/Drawer'
import DrawerCommonContainer from '../../../../component/Drawer/DrawerCommonContainer'
import SimpleInput from '../../../../component/Input/SimpleInput'
import { updateUserInfo } from '../../../../api/server/user'
import Toast from 'react-native-root-toast'
import { store } from '../../../../redux/store'
import { updateServerUserInfo } from '../../../../redux/counter/serverUserSlice'
import Loading from '../../../../component/Loading'

interface SignatureModifyDrawerProps {
  defaultValue?: string
}

interface SignatureModifyDrawerState {
  text: string
}

const MAX_ALLOW_SIZE = 80

export default class SignatureModifyDrawer extends React.Component<
  SignatureModifyDrawerProps,
  SignatureModifyDrawerState
> {
  constructor(
    props: Readonly<SignatureModifyDrawerProps> | SignatureModifyDrawerProps
  ) {
    super(props)
    this.state = { text: '' }
  }

  drawer = React.createRef<Drawer>()

  public open() {
    console.log('open')
    this.setState({ text: this.props.defaultValue ?? '' })
    this.drawer.current?.showDrawer()
  }

  private onChangeText = (text: string) => {
    this.setState({ text })
  }

  private onSubmit = () => {
    if (this.state.text.length >= MAX_ALLOW_SIZE) {
      this.drawer.current?.showToast('字数不可以超过' + MAX_ALLOW_SIZE)
      return
    }
    Loading.showLoading()
    updateUserInfo({
      signature: this.state.text,
    })
      .then(() => {
        Toast.show('修改成功')
        store.dispatch(
          updateServerUserInfo({
            signature: this.state.text,
          })
        )
        this.drawer.current?.closeDrawer()
      })
      .catch(e => {
        this.drawer.current?.showToast('修改失败, ' + e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  render() {
    return (
      <Drawer ref={this.drawer}>
        <DrawerCommonContainer
          title={`修改个性签名(${MAX_ALLOW_SIZE}字内)`}
          onSubmit={this.onSubmit}>
          <SimpleInput
            onChangeText={this.onChangeText}
            textInputProps={{
              numberOfLines: 6,
              multiline: true,
              value: this.state.text,
              textAlignVertical: 'top',
            }}
          />
        </DrawerCommonContainer>
      </Drawer>
    )
  }
}
