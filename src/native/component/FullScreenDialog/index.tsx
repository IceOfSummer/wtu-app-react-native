import {
  Dimensions,
  NativeModules,
  Platform,
  View,
  ViewStyle,
} from 'react-native'
import React, {
  ForwardedRef,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export interface FullScreenDialogRefAttribute {
  open: () => void
  /**
   * @deprecated 请使用open()
   */
  safeOpen: () => void
}

interface FullScreenDialogProps {
  uniqueId: string
  children: any
  containerStyle?: ViewStyle
}

interface OnRef {
  onRef: ForwardedRef<any>
}

/**
 * FullScreenDialog
 * 使用props.children
 */
let FullScreenDialog: React.FC<
  FullScreenDialogProps & RefAttributes<FullScreenDialogRefAttribute>
>

if (Platform.OS === 'android') {
  const dialog = NativeModules.FullScreenDialog

  const Dialog: React.FC<FullScreenDialogProps & OnRef> = props => {
    const isInitSuccess = useRef(false)
    const { width } = Dimensions.get('window')
    const [isHide, setHide] = useState(true)
    // 是否正在等待开启
    const isWaitingOpen = useRef(false)

    useEffect(() => {
      setTimeout(() => {
        dialog.initDialog(
          props.uniqueId,
          (status: boolean, message: string) => {
            console.log(`init: ${status}, msg: ${message}`)
            isInitSuccess.current = true
            if (isWaitingOpen.current) {
              isWaitingOpen.current = false
              openDialog()
            }
          }
        )
      }, 100)
      return () => {
        dialog.removeDialogInstance(props.uniqueId)
      }
    }, [])

    function openDialog() {
      if (!isInitSuccess.current) {
        isWaitingOpen.current = true
        return
      }
      if (isHide) {
        setHide(false)
      }
      dialog.openFullScreenDialog(props.uniqueId)
    }

    function safeOpenDialog() {
      if (!isInitSuccess.current) {
        isWaitingOpen.current = true
        console.log('waiting')
        return
      }
      setTimeout(() => {
        if (isHide) {
          setHide(false)
        }
        dialog.openFullScreenDialog(props.uniqueId)
      }, 100)
    }

    useImperativeHandle<unknown, FullScreenDialogRefAttribute>(
      props.onRef,
      () => ({
        open: openDialog,
        safeOpen: safeOpenDialog,
      })
    )
    console.log(isHide)
    return (
      <View style={[props.containerStyle]} nativeID={props.uniqueId}>
        <View
          style={{
            opacity: isHide ? 0 : 1,
            width: width,
            position: 'absolute',
            top: 40,
          }}>
          {props.children}
        </View>
      </View>
    )
  }

  FullScreenDialog = React.forwardRef<
    FullScreenDialogRefAttribute,
    FullScreenDialogProps
  >((props, ref) => {
    return (
      <Dialog {...props} onRef={ref}>
        {props.children}
      </Dialog>
    )
  })
} else {
  // TODO 兼容IOS
  FullScreenDialog = () => null
}

export default FullScreenDialog
