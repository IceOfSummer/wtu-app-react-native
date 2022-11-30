import React from 'react'
import { OrderDetail } from '../../../../api/server/order'
import Drawer from '../../../../component/Drawer'
import { StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../../../component/Input/SimpleInput'

interface CancelOrderDrawerProps {
  order?: OrderDetail
  drawerRef: React.RefObject<Drawer>
}

const CancelOrderDrawer: React.FC<CancelOrderDrawerProps> = props => {
  const onSubmit = () => {
    // todo 取消订单
  }

  return (
    <Drawer ref={props.drawerRef} style={styles.drawer}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>取消订单</Text>
        <Text style={styles.submitText} onPress={onSubmit}>
          提交
        </Text>
      </View>
      <View>
        <SimpleInput
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
