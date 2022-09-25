import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icons from '../../../../component/Icons'
import { getTradeStat, TradeStat } from '../../../../api/server/stat'
import { getLogger } from '../../../../utils/LoggerUtils'
import KVTextContainer from '../../../../component/Container/KVTextContainer'

const logger = getLogger('src/tabs/PersonalCenterScreen/component/TradeLabel')

/**
 * 显示待发货，待收货等按钮
 */
const TradeLabel: React.FC = () => {
  const [tradeStat, setTradeStat] = useState<TradeStat>()

  useEffect(() => {
    getTradeStat()
      .then(resp => {
        setTradeStat(resp.data)
      })
      .catch(e => logger.error(e.message))
  }, [])

  return (
    <View>
      <View style={global.styles.flexRowJustAround}>
        <KVTextContainer
          icon="&#xe6cc;"
          name="总收入"
          value={tradeStat ? tradeStat.income : 0}
        />
        <KVTextContainer
          icon="&#xe6cd;"
          name="总支出"
          value={tradeStat ? tradeStat.expenditure : 0}
        />
      </View>
      <View style={styles.labelContainer}>
        <View style={styles.appContainer}>
          <Icons
            iconText="&#xe770;"
            size={30}
            color={global.styles.$primary_color}
          />
          <Text style={styles.iconText}>待发货</Text>
        </View>
        <View style={styles.appContainer}>
          <Icons
            iconText="&#xe771;"
            size={30}
            color={global.styles.$primary_color}
          />
          <Text style={styles.iconText}>待收货</Text>
        </View>
        <View style={styles.appContainer}>
          <Icons
            iconText="&#xe772;"
            size={30}
            color={global.styles.$primary_color}
          />
          <Text style={styles.iconText}>待评价</Text>
        </View>
        <View style={styles.appContainer}>
          <Icons
            iconText="&#xe748;"
            size={30}
            color={global.styles.$primary_color}
          />
          <Text style={styles.iconText}>我的订单</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
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
