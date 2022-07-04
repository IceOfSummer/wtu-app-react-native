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
          - 由于教务系统选课系统的代码一言难尽,
          暂时无法查看自己已经选上的课(学校教务系统写的太乱了, 懒得去封装了...)
        </Text>
        <Text style={global.styles.textContent}>
          - 就算使用了选课工具也无法避免学校网络繁忙, 中途可能会需要多次重试
        </Text>
        <Text style={global.styles.h2}>3. 数据缓存</Text>
        <Text style={global.styles.textContent}>
          在某些情况下, 缓存的数据可能不是最新的, 从而导致选课失败.
        </Text>
        <Text style={global.styles.textContent}>
          这个时候可以考虑清除缓存, 点击右上角三个点即可看到相关选项,
          不建议一下全部都清除掉.
        </Text>
      </View>
    </View>
  )
}

export default SubjectSelectTip
