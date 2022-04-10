import React from 'react'
import { Image, ImageProps, Pressable, Text, View } from 'react-native'
import { RouterTypes } from '../../router'
import Icons, { IconsProps } from '../Icons'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'

interface PageLink {
  title: string
  path: keyof RouterTypes
  routeParam?: any
  iconConfig?: Omit<IconsProps, 'onPress'>
  imageConfig?: ImageProps
}

const PageLink: React.FC<PageLink> = props => {
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  if (!props.imageConfig && !props.iconConfig) {
    return <View />
  } else {
    return (
      <Pressable
        style={{ justifyContent: 'center', alignItems: 'center' }}
        onPress={() => nav.navigate(props.path, props.routeParam)}>
        {props.iconConfig ? (
          <Icons {...props.iconConfig} />
        ) : (
          <Image {...props.imageConfig!} />
        )}
        <Text style={{ fontSize: 12, color: global.styles.$text_color }}>
          {props.title}
        </Text>
      </Pressable>
    )
  }
}

export default PageLink
