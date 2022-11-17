import React, { useEffect, useRef, useState } from 'react'
import ShopItem, { ShowItemProps } from '../../components/ShopItem'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import MenuItem from '../../components/MenuItem'
import CenterBanner from '../../components/CenterBanner'
import CenterButton from '../../components/CenterButton'
import BaseContainer from '../../../../component/Container/BaseContainer'
import { SpringScrollView } from 'react-native-spring-scrollview'
import Toast from 'react-native-toast-message'

// TODO 测试用，记得删除
const generateTestData = async (page: number) =>
  new Promise<Array<ShowItemProps>>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.4) {
        resolve([
          {
            id: 100000 + page,
            previewImage: require('../../devImages/iphone2.png'),
            name: 'Apple IPhone 11 二手苹果11 二手手机 移动联通电信',
            price: 999,
            width: 0,
          },
          {
            id: page,
            previewImage: require('../../devImages/iphone2.png'),
            name: 'Apple iPhone 12(A2404) 苹果12国行公开版5G双卡支持',
            price: 999,
            width: 0,
          },
        ])
      } else {
        reject('加载失败')
      }
    })
  })

/**
 * 跳蚤市场(精选Tab)
 * 生活用品 运动器械 娱乐物品 食品 电子设备 衣物 书籍 虚拟商品
 */
const MainTab: React.FC = () => {
  const scrollView = useRef<SpringScrollView>(null)
  /**
   * TODO 前往发布商品页面
   */
  const goSubmitItem = () => {
    console.log('submit')
  }

  /**
   * 底部加载数据的距离阈值
   */
  // 是否正在加载商品数据
  const [isLoadingShopItemData, setLoadingShopItemData] = useState(false)
  // 商品数据
  const [shopItemData, setShopItemData] = useState<Array<ShowItemProps>>([])
  // 商品数据的页数
  const currentPage = useRef(1)

  const [itemContainerWidth, setItemContainerWidth] = useState(0)

  const onItemContainerLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setItemContainerWidth(nativeEvent.layout.width / 2 - 5)
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
      })
      .catch(e => {
        console.log(e)
        Toast.show({
          text1: '加载失败',
          text2: e.message ? e.message : '请稍后重试',
          type: 'error',
        })
      })
      .finally(() => {
        setLoadingShopItemData(false)
        scrollView.current?.endLoading(true)
      })
  }

  useEffect(() => {
    loadMoreShopItemData()
  }, [])

  return (
    <SpringScrollView
      showsVerticalScrollIndicator
      ref={scrollView}
      onLoading={loadMoreShopItemData}
      style={{ flex: 1 }}>
      <View>
        <View style={styles.itemMenuContainer}>
          <View style={styles.menuItem}>
            <MenuItem
              image={require('../../images/daily.png')}
              name="生活用品"
              to="/TODO"
            />
            <MenuItem
              image={require('../../images/basketball.png')}
              name="运动器械"
              backgroundColor="skyblue"
              scale
              to="/TODO"
            />
            <MenuItem
              image={require('../../images/hat.png')}
              name="娱乐物品"
              backgroundColor="orange"
              to="/TODO"
            />
            <MenuItem
              image={require('../../images/fruit.png')}
              name="食品"
              backgroundColor="#FFCC33"
              to="/TODO"
            />
          </View>
          <View style={styles.menuItem}>
            <MenuItem
              image={require('../../images/watch.png')}
              name="电子设备"
              scale
              backgroundColor="#664D33"
              to="/TODO"
            />
            <MenuItem
              image={require('../../images/clothing.png')}
              name="衣物"
              backgroundColor="#6388B0"
              to="/TODO"
            />
            <MenuItem
              image={require('../../images/book.png')}
              name="书籍"
              to="/TODO"
            />
            <MenuItem
              image={require('../../images/cat.png')}
              name="虚拟商品"
              backgroundColor="#BD7AFF"
              to="/TODO"
            />
          </View>
        </View>
      </View>
      <CenterBanner onGoButtonPress={goSubmitItem} />
      <BaseContainer title="快捷功能">
        <View style={styles.functionalContainer}>
          <CenterButton
            image={require('../../images/b2.png')}
            name="找跑腿"
            to="TODO"
          />
          <CenterButton
            image={require('../../images/b3.png')}
            name="出售商品"
            to="TODO"
          />
          <CenterButton
            image={require('../../images/b1.png')}
            name="组团拼单"
            to="TODO"
          />
        </View>
      </BaseContainer>
      <View style={global.styles.baseContainer}>
        <View style={styles.adviceContainer}>
          <Text style={styles.adviceText}>今日推荐</Text>
        </View>
        <View style={styles.shopItemContainer} onLayout={onItemContainerLayout}>
          {shopItemData.map(value => (
            <ShopItem {...value} width={itemContainerWidth} key={value.id} />
          ))}
        </View>
      </View>
    </SpringScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical: 10,
  },
  titleText: {
    fontFamily: 'flea-market-title',
    textAlign: 'center',
    fontSize: 36,
    color: global.styles.$text_color,
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
  functionalContainer: {
    backgroundColor: global.styles.$bg_color,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
  },
})
export default MainTab
