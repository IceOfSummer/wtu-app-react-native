import { TabBar, TabView } from 'react-native-tab-view'
import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import {
  NavigationState,
  Route,
  SceneRendererProps,
} from 'react-native-tab-view/lib/typescript/types'
import SubjectList from './SubjectList'

const renderScene = ({
  route,
}: SceneRendererProps & {
  route: Route
}) => {
  const key = route.key as scenesNames
  switch (key) {
    case 'electives':
      return (
        <SubjectList
          storageKey={ELECTIVES_STORAGE_KEY}
          classMark={{
            xkkz_id: 'D3B144D655222A84E053813B43D3B59D',
            kklxdm: '10',
          }}
        />
      )
    case 'english':
      return (
        <SubjectList
          storageKey={ENGLISH_STORAGE_KEY}
          classMark={{
            xkkz_id: 'D3B675F475E531EDE053813B43D3E9E0',
            kklxdm: '06',
          }}
        />
      )
    case 'pe':
      return (
        <SubjectList
          storageKey={PE_STORAGE_KEY}
          classMark={{
            xkkz_id: 'D3B144D655342A84E053813B43D3B59D',
            kklxdm: '07',
          }}
        />
      )
    default:
      return null
  }
}

type scenesNames = 'electives' | 'english' | 'pe'
export const ELECTIVES_STORAGE_KEY = 'SubjectSelectElectivesStorage'
export const ENGLISH_STORAGE_KEY = 'SubjectSelectEnglishStorage'
export const PE_STORAGE_KEY = 'SubjectSelectPeStorage'

export type SUBJECT_QUERY_STORAGE_KEYS =
  | typeof ELECTIVES_STORAGE_KEY
  | typeof ENGLISH_STORAGE_KEY
  | typeof PE_STORAGE_KEY

type RouteTypes = {
  key: scenesNames
  title: string
}

const Tabs: React.FC = () => {
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [routes] = useState<Array<RouteTypes>>([
    { key: 'electives', title: '选修课' },
    { key: 'english', title: '英语分项' },
    { key: 'pe', title: '体育课' },
  ])
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