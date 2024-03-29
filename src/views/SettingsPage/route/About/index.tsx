import React, { useEffect, useState } from 'react'
import { Image, Linking, StyleSheet, Text, View } from 'react-native'
import { getVersion } from 'react-native-device-info'
import CardContainer from '../../../../component/Cards/CardContainer'
import NavigationCard from '../../../../component/Cards/NavigationCard'
import SimpleCard from '../../../../component/Cards/SimpleCard'
import UpdateChecker from '../../../../utils/UpdateChecker'
import { LOGS_PAGE } from '../../index'
import Environment from '../../../../utils/Environment'
import Toast from 'react-native-root-toast'

const About: React.FC = () => {
  const version = getVersion()
  const [label, setLabel] = useState('')
  useEffect(() => {
    UpdateChecker.getVersionLabel().then(l => {
      if (l) {
        setLabel(l)
      }
    })
  }, [])

  const checkUpdate = () => {
    if (UpdateChecker.newBinaryVersion) {
      // fallback
      UpdateChecker.downLoadNewVersion(
        UpdateChecker.newBinaryVersion,
        '新版本更新'
      )
    } else {
      UpdateChecker.checkUpdate(true)
    }
  }

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(e => {
      Toast.show('打开失败: ' + e.message)
    })
  }

  return (
    <View style={{ height: '100%' }}>
      <View style={styles.iconImageContainer}>
        <Image
          style={styles.iconImage}
          source={require('../../../../assets/img/icon.png')}
        />
        <Text>武纺智联</Text>
        <Text>
          {version}
          {label}
        </Text>
      </View>
      <CardContainer>
        <NavigationCard
          title="反馈问题(Github)"
          onTap={() => openUrl(global.constant.homePageUrl)}
        />
        <NavigationCard
          title="反馈问题(Gitee)"
          onTap={() =>
            openUrl('https://gitee.com/hupeng333/wtu-app-react-native')
          }
        />
        <NavigationCard
          title="反馈问题(Email)"
          onTap={() => openUrl('mailto:' + Environment.support)}
        />
        <NavigationCard title="查看日志" to={LOGS_PAGE} />
        <SimpleCard
          title="检查更新"
          hideBorder
          onTap={checkUpdate}
          rightContent={
            UpdateChecker.newBinaryVersion === version
              ? '已经是最新版本了'
              : UpdateChecker.newBinaryVersion
          }
        />
      </CardContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  iconImage: {
    width: 100,
    height: 100,
  },
  iconImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
})

export default About
