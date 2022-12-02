import React, { useEffect, useState } from 'react'
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { getVersion } from 'react-native-device-info'
import CardContainer from '../../../../component/Cards/CardContainer'
import NavigationCard from '../../../../component/Cards/NavigationCard'
import { quickShowErrorTip } from '../../../../native/modules/NativeDialog'
import SimpleCard from '../../../../component/Cards/SimpleCard'
import UpdateChecker from '../../../../utils/UpdateChecker'
import { LOGS_PAGE } from '../../index'

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
    UpdateChecker.checkUpdate(version).then(r => {
      if (!r) {
        quickShowErrorTip('检查更新', '您已经是最新版本了')
      }
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
          title="查看代码"
          onTap={() => Linking.openURL(global.constant.homePageUrl)}
        />
        <NavigationCard title="查看日志" to={LOGS_PAGE} />
        <SimpleCard
          title="检查更新"
          hideBorder
          onTap={checkUpdate}
          rightContent={
            UpdateChecker.newVersion === version
              ? '已经是最新版本了'
              : UpdateChecker.newVersion
          }
        />
      </CardContainer>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <Text
            style={{
              color: global.styles.$info_color,
              fontSize: global.styles.$font_size_sm,
            }}>
            Powered by
          </Text>
          <Pressable
            onPress={() =>
              Linking.openURL('https://github.com/facebook/react-native')
            }>
            <Text
              style={{
                color: global.styles.$primary_color,
                fontSize: global.styles.$font_size_sm,
              }}>
              &nbsp;React Native
            </Text>
          </Pressable>
        </View>
      </View>
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
