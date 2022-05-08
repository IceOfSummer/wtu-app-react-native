import React from 'react'
import { Text, View } from 'react-native'

const SubjectSelectTip: React.FC = () => {
  return (
    <View>
      <View>
        <Text style={global.styles.h1}>使用须知</Text>
      </View>
      <View style={[global.styles.baseContainer]}>
        <Text style={global.styles.h2}>1.原理介绍</Text>
        <Text style={global.styles.textContent}>
          选课工具的原理是: 缓存你请求服务器的参数,
          即使中途出现意外状况也可以无限重试
        </Text>
        <Text style={global.styles.textContent}>
          打个比方来说: 一辆车从A跑到B, 在学校的教务系统选课, 中途出现问题,
          直接给你打回A点重跑, 而选课工具能够帮助你'在哪里跌倒就在哪里爬起来',
          以此来提高选课效率!
        </Text>
        <Text style={global.styles.blobText}>一旦关闭APP, 缓存就会清除!</Text>
        <Text style={global.styles.h2}>2.注意事项</Text>
        <Text style={global.styles.textContent}>
          - 由于缺少测试机会, 暂时无法查看自己已经选上的课(后续会补充)
        </Text>
        <Text style={global.styles.textContent}>
          - 就算使用了选课工具也无法避免学校网络繁忙, 中途可能会需要多次重试
        </Text>
        <Text style={global.styles.blobText}>
          - 因为缺少测试机会, 重置版APP的选课工具可能(大概率)存在BUG!!!
        </Text>
        <Text
          style={[
            global.styles.blobText,
            { color: global.styles.$error_color },
          ]}>
          -不要期望这个工具能够正常使用! 在下次选课之后才能保证完全可用。
        </Text>
      </View>
    </View>
  )
}

export default SubjectSelectTip
