import React, { useState } from 'react'
import Picker from 'react-native-picker'
import { Modal, Text, View } from 'react-native'

interface PullDownPickerProps<T = string | number> {
  data: Array<T>
  current: T
  onSelect: (index: number, data: T) => void
  title?: string
}

/**
 * 下拉选择器
 */
const PullDownPicker: React.FC<PullDownPickerProps> = props => {
  const DATA_TYPE = typeof props.data[0]
  const [visible, setVisible] = useState(false)
  return (
    <View>
      <View onTouchEnd={() => setVisible(true)}>
        <Text style={{ textAlign: 'right' }}>{props.current}</Text>
      </View>
      <Modal
        transparent={true}
        visible={visible}
        onShow={() => {
          Picker.init({
            pickerData: props.data,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: props.title ? props.title : '请选择',
            pickerToolBarBg: [230, 230, 230, 1],
            pickerBg: [255, 255, 255, 1],
            selectedValue: [props.current],
            onPickerConfirm: data => {
              setVisible(false)
              if (DATA_TYPE === 'number') {
                // 转成number
                props.onSelect(
                  props.data.indexOf(Number.parseInt(data[0], 10)),
                  data[0]
                )
              } else {
                // string
                props.onSelect(props.data.indexOf(data[0]), data[0])
              }
            },
            onPickerCancel: () => {
              setVisible(false)
            },
          })
          Picker.show()
        }}
        onDismiss={() => {
          if (Picker.isPickerShow()) {
            Picker.hide()
          }
        }}>
        <View
          style={{
            position: 'absolute',
            flex: 1,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
          }}
          onTouchEnd={() => {
            setVisible(false)
            Picker.hide()
          }}
        />
      </Modal>
    </View>
  )
}

export default PullDownPicker
