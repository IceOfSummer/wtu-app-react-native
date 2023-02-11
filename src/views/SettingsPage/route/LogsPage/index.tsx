import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import {
  getLogFiles,
  getLogger,
  getLogPath,
} from '../../../../utils/LoggerUtils'
import Button from 'react-native-button'
import { SpringScrollView } from 'react-native-spring-scrollview'
import Share from 'react-native-share'
import Toast from 'react-native-root-toast'
import RNFS from 'react-native-fs'
import Drawer from '../../../../component/Drawer'
import DrawerCommonContainer from '../../../../component/Drawer/DrawerCommonContainer'

const logger = getLogger('/views/SettingsPage/route/LogsPage')

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Array<string>>([])
  const [logText, setLogTexts] = useState('')
  const logPreviewDrawer = useRef<Drawer>(null)

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
      logger.error('share failed: ' + e.message)
      Toast.show('分享失败: ' + e.message)
    })
  }

  const openLogPreview = (_logName: string) => {
    RNFS.readFile('file://' + getLogPath(_logName), 'utf8')
      .then(r => {
        setLogTexts(r)
        logPreviewDrawer.current?.showDrawer()
      })
      .catch(e => {
        logger.error('read file failed: ' + e.message)
        Toast.show('预览日志失败: ' + e.message)
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
          onLongPress={() => openLogPreview(value)}
          key={value}
          containerStyle={styles.buttonContainer}
          onPress={() => checkLog(value)}>
          <View style={styles.buttonInner}>
            <Text style={styles.text}>{value}</Text>
          </View>
        </Button>
      ))}
      <Text style={global.styles.infoTipText}>30天前的日志会自动删除</Text>
      <Drawer ref={logPreviewDrawer}>
        <ScrollView style={{ height: Dimensions.get('window').height / 2 }}>
          <DrawerCommonContainer title="日志预览" buttonText="">
            <Text>{logText}</Text>
          </DrawerCommonContainer>
        </ScrollView>
      </Drawer>
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
