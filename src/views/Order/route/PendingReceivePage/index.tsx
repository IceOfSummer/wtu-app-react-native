import React from 'react'
import { getPendingReceiveOrder } from '../../../../api/server/order'
import PageAdapter from '../../component/PageAdapter'

/**
 * 待收货界面
 */
const PendingReceivePage: React.FC = () => {
  return <PageAdapter loadData={getPendingReceiveOrder} />
}

export default PendingReceivePage
