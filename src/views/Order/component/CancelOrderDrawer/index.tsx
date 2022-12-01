import React, { useEffect, useRef, useState } from 'react'
import { cancelTrade, OrderDetail } from '../../../../api/server/order'
import Drawer from '../../../../component/Drawer'
import { StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../../../component/Input/SimpleInput'
import Loading from '../../../../component/Loading'
import { quickShowErrorTip } from '../../../../native/modules/NativeDialog'

interface CancelOrderDrawerProps {
  order?: OrderDetail
  drawerRef: React.RefObject<Drawer>
  onOrderCancel: (order: OrderDetail) => void
}

const CancelOrderDrawer: React.FC<CancelOrderDrawerProps> = props => {
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
    cancelTrade(order.orderId, remark)
      .then(() => {
        props.drawerRef.current?.closeDrawer()
        quickShowErrorTip('订单取消成功!', '订单已取消')
        props.onOrderCancel(order)
      })
      .catch(e => {
        remarkInputRef.current?.showErrorText('取消失败: ' + e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  return (
    <Drawer ref={props.drawerRef} style={styles.drawer}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>取消订单</Text>
        <Text style={styles.submitText} onPress={onSubmit}>
          提交
        </Text>
      </View>
      <View style={{ width: '100%', paddingBottom: 20 }}>
        <SimpleInput
          ref={remarkInputRef}
          onChangeText={setRemark}
          textInputProps={{
            placeholder: '取消原因',
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
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  submitText: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
  },
})

export default CancelOrderDrawer
