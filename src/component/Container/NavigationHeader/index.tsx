import React, { ComponentType } from 'react'
import { ColorValue, StyleSheet, Text, View } from 'react-native'
import CustomStatusBar from '../CustomStatusBar'
import Icons from '../../Icons'

type NavigationLike = {
  canGoBack: () => boolean
  goBack: () => void
}

interface NavigationHeaderProps {
  backgroundColor?: ColorValue
  title: string
  hideBackButton?: boolean
  /**
   * @deprecated 直接作为子组件传递即可
   */
  headerRight?: (props: NavigationHeaderProps) => Element
  navigation: NavigationLike
  showSplitLine?: boolean
  headerLeft?: ComponentType
  textColor?: string
}

/**
 * 自定义导航头
 */
const NavigationHeader: React.FC<NavigationHeaderProps> = props => {
  const children = props.children ?? props.headerRight?.(props)
  const LeftComponent = props.headerLeft
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: props.backgroundColor,
          borderBottomWidth: props.showSplitLine ? StyleSheet.hairlineWidth : 0,
        },
      ]}>
      <CustomStatusBar />
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          {LeftComponent ? <LeftComponent /> : <BackButton {...props} />}
        </View>
        <Text
          style={[
            styles.title,
            { color: props.textColor ?? global.colors.textColor },
          ]}>
          {props.title}
        </Text>
        <View style={styles.rightContainer}>{children}</View>
      </View>
    </View>
  )
}

const BackButton: React.FC<NavigationHeaderProps> = props => {
  const canBack = !props.hideBackButton && props.navigation.canGoBack()
  if (canBack) {
    return (
      <Icons
        iconText="&#xe61d;"
        color={props.textColor ?? global.colors.textColor}
        size={34}
        onPress={props.navigation.goBack}
      />
    )
  }
  return null
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    zIndex: 1000000,
    paddingBottom: 10,
    borderBottomColor: global.colors.borderColor,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: global.styles.$font_size_lg,
    textAlign: 'center',
    flex: 2,
  },
})

export default NavigationHeader
