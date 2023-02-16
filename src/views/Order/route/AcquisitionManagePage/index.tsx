import React, { useState } from 'react'
import PageAdapter from './PageAdapter'
import { queryAcquisitionByActive } from '../../../../api/server/acquisition'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'

const activeRequest = (page?: number, size?: number) =>
  queryAcquisitionByActive(true, page, size)

const inactiveRequest = (page?: number, size?: number) =>
  queryAcquisitionByActive(false, page, size)

const ActiveAcquisitionRoute = () => {
  return <PageAdapter request={activeRequest} isActive={true} />
}

const InactiveAcquisitionRoute = () => {
  return <PageAdapter request={inactiveRequest} isActive={false} />
}

const renderScene = SceneMap({
  active: ActiveAcquisitionRoute,
  inactive: InactiveAcquisitionRoute,
})

const Route = [
  { key: 'active', title: '收购中' },
  { key: 'inactive', title: '已完成' },
]

const renderTabBar: React.FC<any> = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: 'rgb(33, 150, 243)' }}
  />
)

const AcquisitionManagePage: React.FC = () => {
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

export default AcquisitionManagePage
