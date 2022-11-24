import React, { useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ORDER_CONFIRM_PAGE, UseNavigationGeneric } from '../../../../router'
import { ProcessedCommodity } from '../../../../api/server/commodity'
import { OnRef } from '../../../../component/types'
import Drawer, { DrawerComponent } from '../../../../component/Drawer'

interface LockCommodityDrawerProps {
  commodity: ProcessedCommodity
}
export interface LockCommodityDrawerRefAttribute {
  open: () => void
  close: () => void
}

/**
 * 用户想要锁定商品时弹出的抽屉提示框用于输入备注
 *
 */
const LockCommodityDrawer: React.FC<
  LockCommodityDrawerProps & OnRef<LockCommodityDrawerRefAttribute>
> = props => {
  const [text, setText] = useState('')
  const nav = useNavigation<UseNavigationGeneric>()
  const drawer = useRef<DrawerComponent>(null)
  const lock = () => {
    drawer.current?.closeDrawer()
    // 关闭再转跳
    nav.navigate(ORDER_CONFIRM_PAGE, {
      commodity: props.commodity,
      remark: text,
    })
  }
  React.useImperativeHandle<unknown, LockCommodityDrawerRefAttribute>(
    props.onRef,
    () => ({
      open() {
        drawer.current?.openDrawer()
      },
      close() {
        drawer.current?.closeDrawer()
      },
    })
  )

  return (
    <Drawer drawerRef={drawer}>
      <View style={styles.container}>
        <View style={global.styles.flexRowJustBetween}>
          <View>
            <Text style={global.styles.blobText}>锁定商品: </Text>
          </View>
          <Pressable onPress={lock}>
            <Text style={global.styles.primaryTipText}>提交</Text>
          </Pressable>
        </View>
        <View>
          <TextInput
            placeholder="输入交易备注..."
            multiline
            maxLength={200}
            onChangeText={setText}
          />
        </View>
        <View style={styles.tip}>
          <Text>{text.length} / 200</Text>
        </View>
      </View>
    </Drawer>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 50,
  },
  tip: {
    alignSelf: 'flex-end',
    paddingBottom: 40,
  },
})

export default React.forwardRef<
  LockCommodityDrawerRefAttribute,
  LockCommodityDrawerProps
>((props, ref) => {
  return <LockCommodityDrawer {...props} onRef={ref} />
})
