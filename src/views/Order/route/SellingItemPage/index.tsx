import React, { useEffect, useRef, useState } from 'react'
import { LoadingScrollView } from '../../../../component/LoadingScrollView'
import usePage from '../../../../hook/usePage'
import {
  getUploadedCommodity,
  ProcessedCommodity,
  takeDownCommodity,
} from '../../../../api/server/commodity'
import { StyleSheet, Text, View } from 'react-native'
import BetterImage from '../../../../component/Container/BetterImage'
import NativeDialog, {
  quickShowErrorTip,
  showSingleBtnTip,
} from '../../../../native/modules/NativeDialog'
import BaseContainer from '../../../../component/Container/BaseContainer'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import ModifyCommodityDrawer from '../../component/ModifyCommodityDrawer'
import Drawer from '../../../../component/Drawer'
import { Commodity, CommodityStatus } from '../../../../api/server/types'
import useForceUpdate from '../../../../hook/useForceUpdate'
import Loading from '../../../../component/Loading'
import Icons from '../../../../component/Icons'
import ControlButton from '../../component/ControlButton'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'
import { useNavigation } from '@react-navigation/native'
import { COMMODITY_PAGE, UseNavigationGeneric } from '../../../../router'

const SellingItemPage: React.FC = () => {
  const page = usePage<ProcessedCommodity>(getUploadedCommodity, 5, true)
  const modifyDrawer = useRef<Drawer>(null)
  const nav = useNavigation<UseNavigationGeneric>()
  const [currentCommodity, setCurrentCommodity] = useState<
    ProcessedCommodity | undefined
  >()
  const update = useForceUpdate()
  useEffect(() => {
    page.loadMore().catch(e => {
      quickShowErrorTip('加载失败', e.message)
    })
  }, [])

  const onModify = (commodity: ProcessedCommodity) => {
    setCurrentCommodity(commodity)
    modifyDrawer.current?.showDrawer()
  }

  const onUpdate = (commodity: Partial<Commodity>) => {
    const item = page.data.find(
      value => value.commodityId === commodity.commodityId
    )
    if (!item) {
      return
    }
    Object.assign(item, commodity)
    update()
  }

  const showDetail = (commodity: ProcessedCommodity) => {
    nav.navigate(COMMODITY_PAGE, { id: commodity.commodityId })
  }

  return (
    <LoadingScrollView
      onRequireLoad={page.loadMore}
      dataLength={page.data.length}
      {...page}>
      {page.data.map(value => (
        <CommodityItem
          onUpdate={onUpdate}
          commodity={value}
          onModify={onModify}
          onPress={() => showDetail(value)}
          key={value.commodityId}
        />
      ))}
      <ModifyCommodityDrawer
        commodity={currentCommodity}
        drawerRef={modifyDrawer}
        onUpdate={onUpdate}
      />
      <ConditionHideContainer hide={!page.empty}>
        <Text style={global.styles.infoTipText}>到底了~</Text>
      </ConditionHideContainer>
    </LoadingScrollView>
  )
}

interface CommodityItemProps {
  commodity: ProcessedCommodity
  onModify: (commodity: ProcessedCommodity) => void
  onUpdate: (commodity: Partial<Commodity>) => void
  onPress?: () => void
}

const CommodityItem: React.FC<CommodityItemProps> = props => {
  const { commodity } = props
  const closeCommodity = () => {
    NativeDialog.showDialog({
      title: '确认要下架吗?',
      message: '该操作无法撤销!',
      onConfirm() {
        Loading.showLoading()
        takeDownCommodity(props.commodity.commodityId)
          .then(() => {
            showSingleBtnTip('下架成功', '您的商品已下架')
            props.onUpdate({
              commodityId: commodity.commodityId,
              status: CommodityStatus.STATUS_INACTIVE,
            })
          })
          .catch(e => {
            showSingleBtnTip('请求失败', e.message)
          })
          .finally(() => {
            Loading.hideLoading()
          })
      },
    })
  }
  return (
    <BaseContainer style={styles.container} onPress={props.onPress}>
      <Text style={styles.title}>
        <Icons iconText="&#xe767;" />
        {commodity.name}
      </Text>
      <View style={global.styles.flexRow}>
        <View style={styles.image}>
          <BetterImage uri={commodity.previewImage} />
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.detailContainer}>
            <View>
              <KVTextContainer
                icon="&#xe786;"
                name="交易地点"
                value={commodity.tradeLocation}
              />
              <KVTextContainer
                icon="&#xe63d;"
                name="剩余数量"
                value={commodity.count}
              />
              <KVTextContainer
                icon="&#xe67b;"
                name="当前状态"
                value={
                  commodity.status === CommodityStatus.STATUS_ACTIVE
                    ? '可用'
                    : '已经下架'
                }
                valueColor={
                  commodity.status === CommodityStatus.STATUS_ACTIVE
                    ? undefined
                    : global.colors.error_color
                }
              />
            </View>
            <View style={styles.rightContent}>
              <Text style={global.styles.errorTipText}>
                {commodity.price}￥
              </Text>
              <View style={styles.buttonContainer}>
                <ControlButton
                  color={global.colors.primaryColor}
                  title="修改信息"
                  onPress={() => props.onModify(props.commodity)}
                />
                <ControlButton
                  title="下架商品"
                  color={global.colors.error_color}
                  onPress={closeCommodity}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </BaseContainer>
  )
}

const styles = StyleSheet.create({
  title: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  container: {
    paddingHorizontal: 15,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 4,
    overflow: 'hidden',
    resizeMode: 'stretch',
  },
  rightContent: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'space-between',
  },
  rightContainer: {
    marginLeft: 14,
    justifyContent: 'space-between',
    flex: 1,
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  linkText: {
    color: global.colors.primaryColor,
    textDecorationLine: 'underline',
    fontSize: 12,
    marginHorizontal: global.styles.$spacing_row_base,
  },
})

export default SellingItemPage
