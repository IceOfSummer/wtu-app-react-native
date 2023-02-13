import { StyleSheet, Switch, Text, View } from 'react-native'
import React from 'react'
import Icons from '../../Icons'
import NativeDialog from '../../../native/modules/NativeDialog'

interface SwitchWithLabelProps {
  label: string
  enable?: boolean
  /**
   * 若提供了该值，则会在label后显示一个小问号，用户点击后会弹出信息
   */
  helpText?: string
  /**
   * 帮助标题. 仅提供该值而不提供{@link SwitchWithLabelProps#helpText}不会有任何效果
   */
  helpTitle?: string
  onChange: (value: boolean) => void
}

const SwitchWithLabel: React.FC<SwitchWithLabelProps> = props => {
  const showHelp = () => {
    NativeDialog.showDialog({
      title: props.helpTitle ?? props.label,
      message: props.helpText,
      hideCancelBtn: true,
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Text style={styles.labelText}>
          {props.label}
          {props.helpText ? (
            <Icons iconText="&#xe601;" onPress={showHelp} size={16} />
          ) : null}
        </Text>
      </View>
      <Switch
        value={props.enable}
        onValueChange={props.onChange}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={props.enable ? global.colors.primaryColor : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    color: global.colors.textColor,
  },
})

export default SwitchWithLabel
