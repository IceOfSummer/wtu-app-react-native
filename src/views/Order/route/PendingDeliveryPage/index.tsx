import React from 'react'
import { getPendingDeliveryOrder } from '../../../../api/server/order'
import PageAdapter from '../../component/PageAdapter'

const PendingDeliveryPage: React.FC = () => {
  return <PageAdapter loadData={getPendingDeliveryOrder} />
}

export default PendingDeliveryPage
