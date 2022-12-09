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
import CommodityDetailDrawer from '../../component/CommodityDetailDrawer'

const SellingItemPage: React.FC = () => {
  const page = usePage<ProcessedCommodity>(getUploadedCommodity, 5, true)
  const modifyDrawer = useRef<Drawer>(null)
  const detailDrawer = useRef<Drawer>(null)
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
    setCurrentCommodity(commodity)
    detailDrawer.current?.showDrawer()
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
      <CommodityDetailDrawer
        drawerRef={detailDrawer}
        commodity={currentCommodity}
      />
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
      <View style={styles.image}>
        <BetterImage uri={commodity.previewImage} />
      </View>
      <View style={styles.rightContainer}>
        <Text style={global.styles.blobText}>{commodity.name}</Text>
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
            <Text style={global.styles.errorTipText}>{commodity.price}￥</Text>
            <View style={styles.buttonContainer}>
              <Text
                style={styles.linkText}
                onPress={() => props.onModify(props.commodity)}>
                修改信息
              </Text>
              <Text
                onPress={closeCommodity}
                style={[styles.linkText, { color: global.colors.error_color }]}>
                下架商品
              </Text>
            </View>
          </View>
        </View>
      </View>
    </BaseContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  image: {
    width: 80,
    height: 80,
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
    marginHorizontal: global.styles.$spacing_row_base,
  },
})

export default SellingItemPage
