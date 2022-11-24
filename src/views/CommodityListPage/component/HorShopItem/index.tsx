import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { append0Prefix } from '../../../../utils/DateUtils'
import Icons from '../../../../component/Icons'
import { EsCommodity } from '../../../../api/server/types'
import FastImage from 'react-native-fast-image'
import { appendCdnPrefix } from '../../../../utils/CdnUtil'

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
  return (
    <View style={global.styles.flexRowCenter}>
      <Pressable onPress={props.onClick} style={styles.container}>
        <FastImage
          source={{ uri: appendCdnPrefix(props.image) }}
          style={[styles.image, {}]}
        />
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
                {date.getFullYear()}-{append0Prefix(date.getMonth() + 1)}-
                {append0Prefix(date.getDate())} {append0Prefix(date.getHours())}
                :{date.getMinutes()}
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
  container: {
    overflow: 'hidden',
    flex: 1,
    maxWidth: 400,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '30%',
    height: '100%',
    resizeMode: 'stretch',
    flex: 1,
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
  },
  normalText: {
    color: '#000',
    fontSize: 12,
  },
})
export default HorShopItem
