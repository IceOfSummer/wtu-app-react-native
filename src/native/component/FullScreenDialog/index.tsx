import { Dimensions, NativeModules, Platform, View } from 'react-native'
import React, {
  ForwardedRef,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

export interface FullScreenDialogRefAttribute {
  open: () => void
}

interface FullScreenDialogProps {
  uniqueId: string
  children: any
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
    const width = Dimensions.get('window').width
    const [isHide, setHide] = useState(true)
    useEffect(() => {
      return () => {
        dialog.removeDialogInstance(props.uniqueId)
      }
    }, [])

    useImperativeHandle<unknown, FullScreenDialogRefAttribute>(
      props.onRef,
      () => ({
        open() {
          if (isHide) {
            setHide(false)
          }
          dialog.openFullScreenDialog(props.uniqueId)
        },
      })
    )
    return (
      <View
        style={{
          position: 'absolute',
          opacity: isHide ? 0 : 1,
          top: 40,
          width: width,
        }}
        nativeID={props.uniqueId}>
        {props.children}
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
