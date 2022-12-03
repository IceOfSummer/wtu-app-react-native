import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getLogFiles } from '../../../../utils/LoggerUtils'
import Button from 'react-native-button'
import { SpringScrollView } from 'react-native-spring-scrollview'
import Drawer from '../../../../component/Drawer'
import LogPreview from '../../component/LogPreview'

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Array<string>>([])
  const [logName, setLogName] = useState('')
  const drawer = useRef<Drawer>(null)

  const checkLog = (_logName: string) => {
    setLogName(_logName)
    drawer.current?.showDrawer()
  }

  useEffect(() => {
    getLogFiles().then(files => {
      setLogs(files)
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
      <Drawer ref={drawer}>
        <LogPreview logName={logName} />
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
