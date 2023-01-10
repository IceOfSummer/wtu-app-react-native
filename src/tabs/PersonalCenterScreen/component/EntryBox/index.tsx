import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Icons from '../../../../component/Icons'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'

interface EntryBoxProps {
  icon: string
  title: string
  /**
   * 右上角角标显示的数字
   */
  tipCount?: number
  onPress?: () => void
}
function ensureSize(size?: number) {
  if (size && size > 99) {
    return '99+'
  }
  return size
}

const EntryBox: React.FC<EntryBoxProps> = props => {
  return (
    <Pressable style={styles.appContainer} onPress={props.onPress}>
      <View style={styles.innerContainer}>
        <Icons
          iconText={props.icon}
          size={30}
          color={global.styles.$primary_color}
        />
        <Text style={styles.iconText}>{props.title}</Text>
        <ConditionHideContainer hide={!props.tipCount} style={styles.tip}>
          <Text style={styles.tipText}>{ensureSize(props.tipCount)}</Text>
        </ConditionHideContainer>
      </View>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  iconText: {
    fontSize: global.styles.$font_size_sm,
    color: global.styles.$text_color,
  },
  appContainer: {
    alignItems: 'center',
    width: '25%',
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
  },
  tip: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 20,
    width: 20,
    height: 20,
    right: -10,
    top: -8,
    justifyContent: 'center',
  },
  tipText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: global.styles.$font_size_sm,
    textAlignVertical: 'center',
  },
})

export default EntryBox
