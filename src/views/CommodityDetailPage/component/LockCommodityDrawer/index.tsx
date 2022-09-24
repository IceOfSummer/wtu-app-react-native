import React from 'react'
import { Text, TextInput, View } from 'react-native'

/**
 * 用户想要锁定商品时弹出的抽屉提示框用于输入备注
 *
 * 使用BottomDrawer来显示抽屉，高度设置为<b></b>
 */
const LockCommodityDrawer: React.FC = () => {
  return (
    <View style={{ height: 300 }}>
      <View style={global.styles.flexRowJustBetween}>
        <View>
          <Text style={global.styles.blobText}>锁定商品: </Text>
        </View>
        <View>
          <Text>提交</Text>
        </View>
      </View>
      <View>
        <TextInput placeholder="输入交易备注..." multiline />
      </View>
    </View>
  )
}
export default LockCommodityDrawer
