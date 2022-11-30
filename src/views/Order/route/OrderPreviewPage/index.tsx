import React from 'react'
import PageAdapter from '../../component/PageAdapter'
import { getAllOrder } from '../../../../api/server/order'

const OrderPreviewPage: React.FC = () => {
  return <PageAdapter loadData={getAllOrder} />
}

export default OrderPreviewPage
