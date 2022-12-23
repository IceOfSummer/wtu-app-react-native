import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getLogFiles, getLogPath } from '../../../../utils/LoggerUtils'
import Button from 'react-native-button'
import { SpringScrollView } from 'react-native-spring-scrollview'
import Share from 'react-native-share'
import Toast from 'react-native-root-toast'

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Array<string>>([])

  const checkLog = (_logName: string) => {
    Share.open({
      title: '日志',
      url: 'file://' + getLogPath(_logName),
      failOnCancel: true,
      type: 'text/plain',
    }).catch(e => {
      const msg = e.message as string
      if (msg === 'User did not share') {
        return
      }
      Toast.show('分享失败: ' + e.message)
    })
  }

  useEffect(() => {
    getLogFiles().then(files => {
      setLogs(files.sort((b, a) => a.localeCompare(b)))
    })
  }, [])

  return (
    <SpringScrollView>
      {logs.map(value => (
        <Button
          key={value}
          containerStyle={styles.buttonContainer}
          onPress={() => checkLog(value)}>
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
