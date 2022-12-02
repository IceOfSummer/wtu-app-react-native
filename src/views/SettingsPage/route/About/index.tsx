import React, { useEffect, useState } from 'react'
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { getVersion } from 'react-native-device-info'
import CardContainer from '../../../../component/Cards/CardContainer'
import NavigationCard from '../../../../component/Cards/NavigationCard'
import NativeDialog from '../../../../native/modules/NativeDialog'
import CodePush from 'react-native-code-push'

const About: React.FC = () => {
  const version = getVersion()
  const [label, setLabel] = useState('')
  useEffect(() => {
    CodePush.checkForUpdate('Nfcrb40ux-JDYQ1g73HmDYGIFKe7bHgT4wqQW').then(r => {
      console.log(r)
    })
    CodePush.getUpdateMetadata().then(r => {
      if (r) {
        setLabel('-' + r.label)
      }
    })
  }, [])
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
        <NavigationCard
          title="捐赠"
          hideBorder
          onTap={() =>
            NativeDialog.showDialog({
              title: 'QAQ感谢您的好心',
              message: '目前暂时不需要暂时, 祝您用的开心',
              hideCancelBtn: true,
            })
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
