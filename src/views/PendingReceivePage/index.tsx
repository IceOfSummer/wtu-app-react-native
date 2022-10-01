import React, { useEffect, useRef, useState } from 'react'
import EnhancedScrollView from '../../component/EnhancedScrollView'
import { getTradingRecord, TradingInfo } from '../../api/server/trade'
import { quickShowErrorTip } from '../../native/modules/NativeDialog'
import BaseContainer2 from '../../component/Container/BaseContainer2'
import TradingRecordItem from './component/TradingRecordItem'

/**
 * 待收货界面
 */
const PendingReceivePage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [fail, setFail] = useState(false)
  const [tradingRecord, setTradingRecord] = useState<TradingInfo[]>([])
  const [empty, setEmpty] = useState(false)
  const curPage = useRef(0)
  const PAGE_SIZE = 5

  const loadData = () => {
    setLoading(true)
    getTradingRecord(curPage.current, PAGE_SIZE)
      .then(resp => {
        curPage.current++
        setTradingRecord(resp.data)
        if (resp.data.length < 5) {
          setEmpty(true)
        }
      })
      .catch(e => {
        quickShowErrorTip('请求失败', e.message)
        setFail(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <EnhancedScrollView
      empty={empty}
      onRequireLoad={loadData}
      loading={loading}
      fail={fail}
      dataLength={tradingRecord.length}>
      <BaseContainer2>
        {tradingRecord.map(value => (
          <TradingRecordItem key={value.orderId} {...value} />
        ))}
      </BaseContainer2>
    </EnhancedScrollView>
  )
}

export default PendingReceivePage
