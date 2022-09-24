import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  COMMODITY_DETAIL_PAGE,
  UseNavigationGeneric,
  UseRouteGeneric,
} from '../../router'
import {
  getCommodityDetail,
  ProcessedCommodity,
} from '../../api/server/commodity'
import NativeDialog from '../../native/modules/NativeDialog'
import LoadingView from '../../component/Loading/LoadingView'
import CommodityInfo from './component/CommodityInfo'

/**
 * 商品详细界面
 */
const CommodityDetailPage: React.FC = () => {
  const route = useRoute<UseRouteGeneric<typeof COMMODITY_DETAIL_PAGE>>()
  const nav = useNavigation<UseNavigationGeneric>()
  const [commodity, setCommodity] = useState<ProcessedCommodity | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    loadData()
  }, [])
  const loadData = () => {
    setLoading(true)
    getCommodityDetail(route.params.id)
      .then(({ data }) => {
        if (!data) {
          NativeDialog.showDialog({
            title: '商品不存在',
            message: '该商品不存在',
            hideCancelBtn: true,
            onConfirm() {
              if (nav.canGoBack()) {
                nav.goBack()
              }
            },
          })
          return
        }
        setSuccess(true)
        setCommodity(data)
      })
      .catch(e => {
        setSuccess(false)
        NativeDialog.showDialog({
          title: '出错了',
          message: e.message,
          hideCancelBtn: true,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <LoadingView
      loadCallback={loadData}
      success={success}
      isLoading={isLoading}>
      {commodity ? <CommodityInfo commodity={commodity} /> : null}
    </LoadingView>
  )
}

export default CommodityDetailPage
