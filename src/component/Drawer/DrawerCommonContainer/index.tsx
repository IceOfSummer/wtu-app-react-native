import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface DrawerCommonContainerProps {
  title: string
  buttonText?: string
  onSubmit?: () => void
}

/**
 * 常用的Drawer容器。附带一个通用头部
 */
const DrawerCommonContainer: React.FC<DrawerCommonContainerProps> = props => {
  return (
    <View style={styles.container}>
      <View style={global.styles.flexRowJustBetween}>
        <Text style={styles.title}>{props.title}</Text>
        <Text onPress={props.onSubmit} style={styles.button}>
          {props.buttonText ?? '提交'}
        </Text>
      </View>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  button: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
  },
})

export default DrawerCommonContainer
