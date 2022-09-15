import React from 'react'
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextInputSubmitEditingEventData,
  View,
  ViewStyle,
} from 'react-native'
import Icons from '../../Icons'

interface RoundSearchBarProps {
  onSubmit?: (text: string) => void
  placeHolder?: string
  containerStyle?: ViewStyle
  textInputProps?: TextInputProps
  onContainerPress?: () => void
  outerStyle?: ViewStyle
  onFocus?: () => void
  disable?: boolean
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
    <View style={[styles.barOuterContainer, props.outerStyle]}>
      <Pressable
        style={[styles.barContainer, props.containerStyle]}
        onPress={props.onContainerPress}>
        <Icons iconText="&#xe632;" size={18} />
        <TextInput
          {...props.textInputProps}
          placeholder={props.placeHolder}
          onFocus={props.onFocus}
          style={styles.textInputStyle}
          returnKeyType="search"
          editable={!props.disable}
          selectionColor={global.styles.$primary_color}
          onSubmitEditing={onSubmitEditing}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  barOuterContainer: {
    paddingHorizontal: 5,
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
