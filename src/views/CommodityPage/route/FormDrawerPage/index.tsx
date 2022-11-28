import React, { useRef, useState } from 'react'
import NavigationDrawerWrapper from '../../../../component/Drawer/NavigationDrawerWrapper'
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import {
  CommodityPageRouteTypes,
  CONFIRM_PAGE,
  FORM_DRAWER_PAGE,
} from '../../index'
import { checkNumber } from '../../../../component/Input'
import { NavigationProp } from '@react-navigation/core/src/types'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../../../component/Input/SimpleInput'
import { RouterTypes } from '../../../../router'

const FormDrawerPage: React.FC = () => {
  const { params } =
    useRoute<RouteProp<CommodityPageRouteTypes, typeof FORM_DRAWER_PAGE>>()
  const [text, setText] = useState('')
  const [count, setCount] = useState('')
  const nav =
    useNavigation<NavigationProp<RouterTypes & CommodityPageRouteTypes>>()
  const countRef = useRef<SimpleInput>(null)
  const lock = () => {
    const reason = checkNumber({
      min: 1,
      max: params.commodity.count,
      noDecimal: true,
    })(count, '数量')
    if (reason) {
      countRef.current?.showErrorText(reason)
      return
    }
    nav.dispatch(
      StackActions.replace(CONFIRM_PAGE, {
        commodity: params.commodity,
        remark: text,
        count: Number.parseInt(count, 10),
      })
    )
  }
  return (
    <NavigationDrawerWrapper>
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
          <SimpleInput
            ref={countRef}
            rowTipText="件"
            onChangeText={setCount}
            textInputProps={{ placeholder: '请输入件数' }}
          />
          <SimpleInput
            textInputProps={{
              placeholder: '输入交易备注...',
              multiline: true,
              maxLength: 200,
              numberOfLines: 5,
              textAlignVertical: 'top',
            }}
            onChangeText={setText}
          />
        </View>
        <View style={styles.tip}>
          <Text>{text.length} / 200</Text>
        </View>
      </View>
    </NavigationDrawerWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  tip: {
    alignSelf: 'flex-end',
    paddingBottom: 40,
  },
})

export default FormDrawerPage
