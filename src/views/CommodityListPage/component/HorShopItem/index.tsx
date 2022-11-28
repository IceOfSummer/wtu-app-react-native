import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { formatTimestamp } from '../../../../utils/DateUtils'
import Icons from '../../../../component/Icons'
import { EsCommodity } from '../../../../api/server/types'
import BetterImage from '../../../../component/Container/BetterImage'

interface HorShopItemProps {
  onClick?: () => void
}

/**
 * 横着显示的商品
 * @param props
 * @constructor
 */
const HorShopItem: React.FC<EsCommodity & HorShopItemProps> = props => {
  const date = new Date(props.createTime)
  const standerPrice = props.price.toFixed(2)
  const dimensions = useWindowDimensions()
  const len = dimensions.height / 6
  return (
    <View style={styles.outer}>
      <Pressable
        onPress={props.onClick}
        style={[styles.container, { height: len }]}>
        <View style={{ width: len, height: len, padding: 5 }}>
          <BetterImage
            uri={props.image}
            imageProp={{
              style: { flex: 1, borderRadius: 8 },
              resizeMode: 'stretch',
            }}
            width="100%"
            height="100%"
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={global.styles.blobText} ellipsizeMode="tail">
            {props.name}
          </Text>
          <View style={global.styles.flexRow}>
            <Icons iconText="&#xe786;" color="#000" size={13} />
            <Text style={styles.normalText}>{props.tradeLocation}</Text>
          </View>
          <View style={styles.bottomContainer}>
            <View>
              <Text style={global.styles.errorTipText}>{standerPrice}￥</Text>
            </View>
            <View style={global.styles.flexRowCenter}>
              <Icons
                iconText="&#xe662;"
                color={global.styles.$primary_color}
                size={12}
              />
              <Text style={global.styles.primaryTipText}>
                {formatTimestamp(date.getTime())}
              </Text>
            </View>
            <View>
              <Icons iconText="&#xe636;" />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 10,
  },
  container: {
    overflow: 'hidden',
    flex: 1,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  image: {
    resizeMode: 'stretch',
  },
  descriptionContainer: {
    flex: 2,
    marginLeft: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 18,
    flexWrap: 'wrap',
  },
  normalText: {
    color: '#000',
    fontSize: 12,
  },
})
export default HorShopItem
