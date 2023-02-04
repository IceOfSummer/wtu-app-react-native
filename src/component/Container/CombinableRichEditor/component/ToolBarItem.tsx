import React from 'react'
import { StyleSheet, TouchableHighlight } from 'react-native'
import Icons from '../../../Icons'

interface ToolBarItemProps {
  icon: string
  script?: string
  onPress?: (script: string) => void
  active?: boolean
}

const ToolBarItem: React.FC<ToolBarItemProps> = props => {
  return (
    <TouchableHighlight
      style={styles.toolbarItem}
      activeOpacity={0.6}
      onPress={() => props.onPress?.(props.script ?? '')}
      underlayColor="#DDDDDD">
      <Icons
        iconText={props.icon}
        size={25}
        color={props.active ? global.colors.primaryColor : undefined}
      />
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  toolbarItem: {
    minWidth: 30,
    alignItems: 'center',
  },
})

export default ToolBarItem
