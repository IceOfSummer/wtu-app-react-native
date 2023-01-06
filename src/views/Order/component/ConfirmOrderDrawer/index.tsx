import React, { useEffect, useRef, useState } from 'react'
import { markTradeDone, OrderPreview } from '../../../../api/server/order'
import Drawer from '../../../../component/Drawer'
import { StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../../../component/Input/SimpleInput'
import Loading from '../../../../component/Loading'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'

interface ConfirmOrderDrawerProps {
  order: OrderPreview
  onOrderConfirm: () => void
  drawerRef: React.RefObject<Drawer>
}

const ConfirmOrderDrawer: React.FC<ConfirmOrderDrawerProps> = props => {
  const [remark, setRemark] = useState('')
  const remarkInputRef = useRef<SimpleInput>(null)

  useEffect(() => {
    setRemark('')
  }, [props.order])

  const onSubmit = () => {
    const { order } = props
    if (!order) {
      return
    }
    Loading.showLoading('处理中...')
    console.log(order)
    markTradeDone(order.orderId, remark)
      .then(() => {
        props.drawerRef.current?.closeDrawer()
        props.onOrderConfirm()
        showSingleBtnTip('确认收货成功!', '订单已确认收货')
      })
      .catch(e => {
        remarkInputRef.current?.showErrorText('确认失败: ' + e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  return (
    <Drawer ref={props.drawerRef} style={styles.drawer}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>确认收货</Text>
        <Text style={styles.submitText} onPress={onSubmit}>
          提交
        </Text>
      </View>
      <View style={{ width: '100%', paddingBottom: 20 }}>
        <SimpleInput
          ref={remarkInputRef}
          onChangeText={setRemark}
          textInputProps={{
            placeholder: '备注(可选)',
            multiline: true,
            numberOfLines: 4,
            textAlignVertical: 'top',
          }}
        />
      </View>
    </Drawer>
  )
}

const styles = StyleSheet.create({
  drawer: {
    paddingHorizontal: 15,
  },
  headerContainer: {
    marginTop: global.styles.$spacing_col_lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
    fontWeight: 'bold',
  },
  submitText: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
  },
})
export default ConfirmOrderDrawer
