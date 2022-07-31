import React, { useEffect, useRef, useState } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar/index'
import Icons from '../../component/Icons'
import MenuItem from './components/MenuItem'
import BaseContainer from '../../component/Container/BaseContainer'
import CenterButton from './components/CenterButton'
import ShopItem, { ShowItemProps } from './components/ShopItem'
import CenterBanner from './components/CenterBanner'

// TODO 测试用，记得删除
const generateTestData = async (page: number) =>
  new Promise<Array<ShowItemProps>>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.4) {
        resolve([
          {
            id: 100000 + page,
            previewImage: require('./components/devImages/iphone.png'),
            name: 'Apple IPhone 11 二手苹果11 二手手机 移动联通电信',
            price: 999,
          },
          {
            id: page,
            previewImage: require('./components/devImages/iphone2.png'),
            name: 'Apple iPhone 12(A2404) 苹果12国行公开版5G双卡支持',
            price: 999,
          },
        ])
      } else {
        reject('加载失败')
      }
    })
  })

/**
 * 跳蚤市场
 * 生活用品 运动器械 娱乐物品 食品 电子设备 衣物 书籍 虚拟商品
 */
const FleaMarketScreen: React.FC = () => {
  const [searchBarPlaceholder] = useState('搜索您喜欢的商品')
  // 是否显示消息的红点
  const [showMessageRedPoint] = useState(true)
  /**
   * TODO 前往发布商品页面
   */
  const goSubmitItem = () => {
    console.log('submit')
  }

  /**
   * 底部加载数据的距离阈值
   */
  const REFRESH_DISTANCE = 30
  // 是否正在加载商品数据
  const [isLoadingShopItemData, setLoadingShopItemData] = useState(false)
  // 加载是否失败(提供刷新选项)
  const [isLoadingFail, setLoadingFail] = useState(false)
  // 商品数据
  const [shopItemData, setShopItemData] = useState<Array<ShowItemProps>>([])
  // 商品数据的页数
  const currentPage = useRef(1)
  /**
   * 监听滚动事件，当滚动到距底部一定位置时加载更多数据
   */
  const onScrollEvent = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (
      nativeEvent.contentSize.height -
        nativeEvent.layoutMeasurement.height -
        nativeEvent.contentOffset.y <=
      REFRESH_DISTANCE
    ) {
      if (!isLoadingFail) {
        loadMoreShopItemData()
      }
    }
  }

  const loadMoreShopItemData = () => {
    if (isLoadingShopItemData) {
      return
    }
    setLoadingShopItemData(true)
    // TODO 加载商品数据
    // 50%成功
    generateTestData(currentPage.current++)
      .then(resp => {
        setShopItemData(shopItemData.concat(resp))
        setLoadingFail(false)
        console.log('load more data success')
      })
      .catch(() => {
        setLoadingFail(true)
        console.log('load more data fail')
      })
      .finally(() => {
        setLoadingShopItemData(false)
      })
  }

  useEffect(() => {
    loadMoreShopItemData()
  }, [])

  return (
    <View>
      <View>
        <View
          style={[global.styles.flexRowJustBetween, styles.headerContainer]}>
          <RoundSearchBar
            containerStyle={styles.searchBarStyle}
            placeHolder={searchBarPlaceholder}
          />
          <MessageBoxIcon showRedPoint={showMessageRedPoint} />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} onScroll={onScrollEvent}>
        <View style={styles.headerTextContainer}>
          <View style={styles.headerTextItemContainer}>
            <Icons
              iconText="&#xe681;"
              size={18}
              color={global.styles.$text_color}
            />
            <Text style={styles.headerText}>方便</Text>
          </View>
          <View style={styles.headerTextItemContainer}>
            <Icons
              iconText="&#xe67b;"
              size={16}
              color={global.styles.$text_color}
            />
            <Text style={styles.headerText}>快捷</Text>
          </View>
          <View style={styles.headerTextItemContainer}>
            <Icons
              iconText="&#xe63d;"
              size={16}
              color={global.styles.$text_color}
            />
            <Text style={styles.headerText}>自由</Text>
          </View>
        </View>
        <BaseContainer>
          <View style={styles.itemMenuContainer}>
            <View style={styles.menuItem}>
              <MenuItem
                image={require('./components/images/daily.png')}
                name="生活用品"
                to="/TODO"
              />
              <MenuItem
                image={require('./components/images/basketball.png')}
                name="运动器械"
                backgroundColor="skyblue"
                scale
                to="/TODO"
              />
              <MenuItem
                image={require('./components/images/hat.png')}
                name="娱乐物品"
                backgroundColor="orange"
                to="/TODO"
              />
              <MenuItem
                image={require('./components/images/fruit.png')}
                name="食品"
                backgroundColor="#FFCC33"
                to="/TODO"
              />
            </View>
            <View style={styles.menuItem}>
              <MenuItem
                image={require('./components/images/watch.png')}
                name="电子设备"
                scale
                backgroundColor="#664D33"
                to="/TODO"
              />
              <MenuItem
                image={require('./components/images/clothing.png')}
                name="衣物"
                backgroundColor="#6388B0"
                to="/TODO"
              />
              <MenuItem
                image={require('./components/images/book.png')}
                name="书籍"
                to="/TODO"
              />
              <MenuItem
                image={require('./components/images/cat.png')}
                name="虚拟商品"
                backgroundColor="#BD7AFF"
                to="/TODO"
              />
            </View>
          </View>
        </BaseContainer>
        <CenterBanner onGoButtonPress={goSubmitItem} />
        <BaseContainer style={global.styles.flexRowJustAround}>
          <CenterButton
            image={require('./components/images/b2.png')}
            name="找跑腿"
            to="TODO"
          />
          <CenterButton
            image={require('./components/images/b3.png')}
            name="出售商品"
            to="TODO"
          />
          <CenterButton
            image={require('./components/images/b1.png')}
            name="组团拼单"
            to="TODO"
          />
        </BaseContainer>
        <BaseContainer darkBackground>
          <View style={styles.adviceContainer}>
            <Text style={styles.adviceText}>今日推荐</Text>
          </View>
          <View style={styles.shopItemContainer}>
            {shopItemData.map(value => (
              <ShopItem {...value} key={value.id} />
            ))}
          </View>
        </BaseContainer>
        <Pressable
          onPress={loadMoreShopItemData}
          style={{
            display: isLoadingFail && !isLoadingShopItemData ? 'flex' : 'none',
          }}>
          <Text style={global.styles.errorTipText}>加载失败, 点我重试</Text>
        </Pressable>
        <View
          style={{
            opacity: isLoadingShopItemData ? 1 : 0,
          }}>
          <Text style={global.styles.primaryTipText}>加载中</Text>
        </View>
        <View style={{ paddingVertical: 25, width: '100%' }} />
      </ScrollView>
    </View>
  )
}

interface MessageBoxIconProps {
  showRedPoint?: boolean
}

/**
 * 右上角的消息图标
 */
const MessageBoxIcon: React.FC<MessageBoxIconProps> = props => {
  return (
    <View style={{ position: 'relative' }}>
      <Icons iconText="&#xe8bd;" size={28} />
      <View
        style={[
          styles.redPoint,
          { display: props.showRedPoint ? 'flex' : 'none' },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 8,
    marginVertical: 5,
  },
  titleContainer: {
    paddingVertical: 10,
  },
  titleText: {
    fontFamily: 'flea-market-title',
    textAlign: 'center',
    fontSize: 36,
    color: global.styles.$text_color,
  },
  searchBarStyle: {
    opacity: 0.9,
  },
  headerText: {
    color: global.styles.$text_color,
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerTextItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 6,
  },
  headerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: 300,
  },
  itemMenuOuterContainer: {
    paddingHorizontal: 10,
    marginVertical: global.styles.$spacing_col_sm,
  },
  itemMenuContainer: {
    backgroundColor: global.styles.$bg_color,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logoCard: {
    padding: 2,
    borderRadius: 4,
    marginRight: 5,
  },
  adviceContainer: {
    marginVertical: 10,
    paddingBottom: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: global.styles.$border_color,
  },
  adviceText: {
    color: global.styles.$text_color,
    fontSize: global.styles.$font_size_base,
  },
  shopItemContainer: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  redPoint: {
    width: 8,
    height: 8,
    borderRadius: 20,
    backgroundColor: 'red',
    position: 'absolute',
    right: 0,
    top: 0,
  },
})
export default FleaMarketScreen
