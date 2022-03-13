import React, { ForwardedRef, useImperativeHandle, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import Button from 'react-native-button'

interface BasicDialogProps {
  onRef?: ForwardedRef<any>
}

export type BasicDialogRefAttribute = {
  showDialog: (config: showDialogConfig) => void
  closeDialog: () => void
}

type showDialogConfig = {
  title: string
  content?: string
  type?: dialogTypes
  hideCancel?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

type dialogTypes = 'warn' | 'info' | 'error' | undefined

const styles = StyleSheet.create({
  dialogOuter: {
    backgroundColor: '#fff',
    paddingTop: 20,
    borderRadius: 8,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  buttonGroup: {
    marginTop: 30,
    flexDirection: 'row',
  },
  button: {
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 10,
    borderWidth: 0.4,
    borderColor: global.styles.$border_color,
    flexGrow: 1,
  },
})

const BasicDialog: React.FC<BasicDialogProps> = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const [dialogConfig, setDialogConfig] = useState<showDialogConfig>({
    title: '',
    content: '',
  })

  const showDialog = (config: showDialogConfig) => {
    setVisible(true)
    setDialogConfig(config)
  }

  const castColor = (type: dialogTypes): string => {
    if (!type) {
      return '#000'
    } else if (type === 'error') {
      return global.styles.$error_color
    } else if (type === 'warn') {
      return global.styles.$warning_color
    } else {
      return '#000'
    }
  }

  /**
   * 执行确认回调
   */
  const executeConfirmCallback = () => {
    setVisible(false)
    dialogConfig.onConfirm?.()
  }

  /**
   * 执行取消回调
   */
  const executeCancelCallback = () => {
    setVisible(false)
    dialogConfig.onCancel?.()
  }

  const closeDialog = () => {
    setVisible(false)
  }

  useImperativeHandle<unknown, BasicDialogRefAttribute>(props.onRef, () => ({
    showDialog,
    closeDialog,
  }))

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeInUp"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}>
      <View style={styles.dialogOuter}>
        <View>
          <Text
            style={{
              color: castColor(dialogConfig.type),
              fontSize: 16,
              textAlign: 'center',
            }}>
            {dialogConfig.title}
          </Text>
        </View>
        <View style={{ height: 20 }} />
        <View>
          <Text
            style={{ color: global.styles.$info_color, textAlign: 'center' }}>
            {dialogConfig.content}
          </Text>
        </View>
        <View style={styles.buttonGroup}>
          <Button
            style={styles.button}
            containerStyle={styles.buttonContainer}
            onPress={executeConfirmCallback}>
            确定
          </Button>
          {dialogConfig.hideCancel ? null : (
            <Button
              onPress={executeCancelCallback}
              style={{ ...styles.button, color: '#000' }}
              containerStyle={styles.buttonContainer}>
              取消
            </Button>
          )}
        </View>
      </View>
    </Modal>
  )
}

export default React.forwardRef<BasicDialogRefAttribute, {}>((props, ref) => {
  return <BasicDialog onRef={ref} />
})
