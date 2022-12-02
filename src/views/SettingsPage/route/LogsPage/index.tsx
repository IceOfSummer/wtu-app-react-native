import React, { useEffect, useState } from 'react'
import { Share, StyleSheet, Text, View } from 'react-native'
import { getLogFiles, getLogPath } from '../../../../utils/LoggerUtils'
import Button from 'react-native-button'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { quickShowErrorTip } from '../../../../native/modules/NativeDialog'

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Array<string>>([])
  useEffect(() => {
    getLogFiles().then(files => {
      setLogs(files)
    })
  }, [])

  const onPress = (logname: string) => {
    Share.share({
      url: getLogPath(logname),
      message: '查看日志',
    }).catch(e => {
      quickShowErrorTip('查看失败', e.message)
    })
  }
  return (
    <SpringScrollView>
      {logs.map(value => (
        <Button
          key={value}
          containerStyle={styles.buttonContainer}
          onPress={() => onPress(value)}>
          <View style={styles.buttonInner}>
            <Text style={styles.text}>{value}</Text>
          </View>
        </Button>
      ))}
      <Text style={global.styles.infoTipText}>30天前的日志会自动删除</Text>
    </SpringScrollView>
  )
}

const styles = StyleSheet.create({
  text: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  buttonContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: global.colors.boxBackgroundColor,
    borderTopColor: global.colors.borderColor,
  },
  buttonInner: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
})

export default LogsPage
