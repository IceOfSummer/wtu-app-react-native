import { TabBar, TabView } from 'react-native-tab-view'
import React, { useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import {
  NavigationState,
  Route,
  SceneRendererProps,
} from 'react-native-tab-view/lib/typescript/types'
import SubjectList from './SubjectList'
import PrimaryButton from '../../../component/Button/PrimaryButton'
import useGlobalState from '../useGlobalState'
import { SubjectSelectItem } from '../../../api/edu/subjectSelect'
/**
 * 用于懒加载
 */
const LazyLoadView: React.FC = props => {
  const [ready, setReady] = useState(false)
  if (ready) {
    return <React.Fragment>{props.children}</React.Fragment>
  }
  return (
    <View>
      <PrimaryButton title="初始化课程" onPress={() => setReady(true)} />
    </View>
  )
}

/**
 * 渲染横向tabs
 */
const renderScene = ({
  route,
}: SceneRendererProps & {
  route: Route & SubjectSelectItem
}) => {
  return (
    <LazyLoadView>
      <SubjectList
        storageKey={route.xkkz_id}
        classMark={{
          xkkz_id: route.xkkz_id,
          kklxdm: route.kklxdm,
        }}
      />
    </LazyLoadView>
  )
}

const Tabs: React.FC = () => {
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const globalState = useGlobalState()
  const baseQueryParam = globalState.getBaseQueryParam()
  const [routes] = useState<Array<SubjectSelectItem>>(
    baseQueryParam ? baseQueryParam.availableSelect : []
  )
  return (
    <TabView
      onIndexChange={setIndex}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={CustomTabBar}
      initialLayout={{ width: layout.width }}
    />
  )
}

const CustomTabBar: React.FC<
  SceneRendererProps & {
    navigationState: NavigationState<Route>
  }
> = props => {
  return (
    <TabBar
      {...props}
      style={{ backgroundColor: '#fff' }}
      labelStyle={{ color: global.styles.$text_color }}
      indicatorStyle={{ backgroundColor: global.styles.$primary_color }}
    />
  )
}

export default Tabs
