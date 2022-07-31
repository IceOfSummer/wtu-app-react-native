import React from 'react'
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
  ViewStyle,
} from 'react-native'
import Icons from '../../Icons'

interface RoundSearchBarProps {
  onSubmit?: (text: string) => void
  placeHolder?: string
  containerStyle?: ViewStyle
}

/**
 * 圆角的搜索框
 */
const RoundSearchBar: React.FC<RoundSearchBarProps> = props => {
  const onSubmitEditing = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    props.onSubmit?.(nativeEvent.text)
  }
  return (
    <View style={styles.barOuterContainer}>
      <View style={[styles.barContainer, props.containerStyle]}>
        <Icons iconText="&#xe632;" size={18} />
        <TextInput
          placeholder={props.placeHolder}
          style={styles.textInputStyle}
          returnKeyType="search"
          selectionColor={global.styles.$primary_color}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  barOuterContainer: {
    paddingHorizontal: 5,
    flex: 1,
  },
  barContainer: {
    backgroundColor: global.styles.$bg_color,
    borderRadius: 15,
    height: 36,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputStyle: {
    flex: 1,
    height: '100%',
    fontSize: 12,
  },
})

export default RoundSearchBar
