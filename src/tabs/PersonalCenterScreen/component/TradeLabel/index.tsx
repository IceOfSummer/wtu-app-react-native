import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { getTradeStat, TradeStat } from '../../../../api/server/stat'
import { getLogger } from '../../../../utils/LoggerUtils'
import { StackActions, useNavigation } from '@react-navigation/native'
import { ORDER_PAGE, UseNavigationGeneric } from '../../../../router'
import {
  ORDER_PREVIEW_PAGE,
  PENDING_DELIVERY_PAGE,
  PENDING_RECEIVE_PAGE,
  SELLING_ITEM_PAGE,
} from '../../../../views/Order'
import EntryBox from '../EntryBox'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { modifyKVData } from '../../../../redux/counter/temporaryDataSlice'

const logger = getLogger('src/tabs/PersonalCenterScreen/component/TradeLabel')

/**
 * 显示待发货，待收货等按钮
 */
const TradeLabel: React.FC = () => {
  const tradeStat = useSelector<ReducerTypes, TradeStat | undefined>(
    state => state.temporary.tradeStat
  )
  const dispatch = useDispatch()
  const nav = useNavigation<UseNavigationGeneric>()

  useEffect(() => {
    getTradeStat()
      .then(resp => {
        dispatch(modifyKVData({ tradeStat: resp.data }))
      })
      .catch(e => logger.error(e.message))
  }, [])

  return (
    <View style={styles.labelContainer}>
      <EntryBox
        icon="&#xe770;"
        title="待发货"
        tipCount={tradeStat?.deliveryCount}
        onPress={() =>
          nav.dispatch(
            StackActions.push(ORDER_PAGE, { screen: PENDING_DELIVERY_PAGE })
          )
        }
      />
      <EntryBox
        icon="&#xe771;"
        title="待收货"
        tipCount={tradeStat?.receiveCount}
        onPress={() =>
          nav.dispatch(
            StackActions.push(ORDER_PAGE, { screen: PENDING_RECEIVE_PAGE })
          )
        }
      />
      <EntryBox
        icon="&#xe767;"
        title="我的商品"
        onPress={() =>
          nav.dispatch(
            StackActions.push(ORDER_PAGE, { screen: SELLING_ITEM_PAGE })
          )
        }
      />
      <EntryBox
        icon="&#xe748;"
        title="我的订单"
        onPress={() =>
          nav.dispatch(
            StackActions.push(ORDER_PAGE, { screen: ORDER_PREVIEW_PAGE })
          )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  iconText: {
    fontSize: global.styles.$font_size_sm,
    color: global.styles.$text_color,
  },
  appContainer: {
    alignItems: 'center',
    width: '25%',
  },
})

export default TradeLabel
