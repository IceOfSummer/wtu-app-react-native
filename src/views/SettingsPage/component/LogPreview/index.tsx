import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { SpringScrollView } from 'react-native-spring-scrollview'
import Share from 'react-native-share'
import { quickShowErrorTip } from '../../../../native/modules/NativeDialog'
import { getLogPath } from '../../../../utils/LoggerUtils'
import fs from 'react-native-fs'

interface LogPreviewProps {
  logName: string
}

const height = Dimensions.get('screen').height - 90
/**
 * 日志预览。计划为日志添加彩色字体。
 */
const LogPreview: React.FC<LogPreviewProps> = props => {
  const [logText, setLogText] = useState('')

  const share = () => {
    Share.open({
      title: '日志',
      url: 'file://' + getLogPath(props.logName),
      failOnCancel: true,
      type: 'text/plain',
    }).catch(e => {
      const msg = e.message as string
      if (msg === 'User did not share') {
        return
      }
      quickShowErrorTip('分享失败', e.message)
    })
  }

  useEffect(() => {
    fs.readFile(getLogPath(props.logName), 'utf8')
      .then(setLogText)
      .catch(e => quickShowErrorTip('加载日志失败', e.message))
  }, [props.logName])

  return (
    <View style={styles.container}>
      <View style={[global.styles.flexRowJustBetween, styles.header]}>
        <Text style={styles.nameText}>{props.logName}</Text>
        <Text style={styles.shareText} onPress={share}>
          分享
        </Text>
      </View>
      <SpringScrollView showsVerticalScrollIndicator>
        <Text>{logText}</Text>
      </SpringScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height,
    width: '100%',
    padding: 15,
  },
  header: {
    marginBottom: global.styles.$spacing_col_base,
  },
  nameText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  shareText: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
  },
})

export default LogPreview
