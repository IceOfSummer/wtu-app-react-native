import React, { useState } from 'react'
import { getUploadedCommodity } from '../../../../api/server/commodity'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import PageAdapter from './PageAdapter'

const Route = [
  { key: 'selling', title: '售卖中' },
  { key: 'offline', title: '已下架' },
]

const sellingCommodityRequest = (page: number, size: number) =>
  getUploadedCommodity(true, page, size)
const offlineCommodityRequest = (page: number, size: number) =>
  getUploadedCommodity(false, page, size)

const SellingCommodityRoute = () => {
  return <PageAdapter request={sellingCommodityRequest} />
}

const OfflineCommodityRoute = () => {
  return <PageAdapter request={offlineCommodityRequest} />
}

const renderScene = SceneMap<typeof Route>({
  selling: SellingCommodityRoute,
  offline: OfflineCommodityRoute,
})

const renderTabBar: React.FC<any> = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: 'rgb(33, 150, 243)' }}
  />
)

const SellingItemPage: React.FC = () => {
  const [routeIndex, setRouteIndex] = useState(0)

  return (
    <TabView
      lazy
      renderTabBar={renderTabBar}
      onIndexChange={setRouteIndex}
      navigationState={{ routes: Route, index: routeIndex }}
      renderScene={renderScene}
    />
  )
}

export default SellingItemPage
