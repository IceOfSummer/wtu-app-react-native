import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import Icons from '../../../component/Icons'
import { append0Prefix } from '../../../utils/DateUtils'

interface HorShopItemProps {
  id: number
  name: string
  price: string
  image: string
  createTime: number
}

/**
 * 横着显示的商品
 * @param props
 * @constructor
 */
const HorShopItem: React.FC<HorShopItemProps> = props => {
  const date = new Date(props.createTime)
  return (
    <View style={global.styles.flexRowCenter}>
      <View style={styles.contaner}>
        <Image source={{ uri: props.image }} style={[styles.image, {}]} />
        <View style={styles.descriptionContainer}>
          <Text style={global.styles.blobText} ellipsizeMode="tail">
            {props.name}
          </Text>
          <View style={styles.bottomContainer}>
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
              <Text style={global.styles.errorTipText}>{props.price}￥</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  contaner: {
    overflow: 'hidden',
    flex: 1,
    maxWidth: 400,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
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
})
export default HorShopItem
