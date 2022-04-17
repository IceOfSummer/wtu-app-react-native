import React, { useEffect, useState } from 'react'
import {
  getScoreDetail,
  ScoreDetails,
  SubjectScore,
} from '../../../api/edu/applications'
import { StyleSheet, Text, View } from 'react-native'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../redux/reducers'
import ContentLoader, { Rect } from 'react-content-loader/native'
import NativeDialog from '../../../native/modules/NativeDialog'
import BounceScrollView from '../../../native/component/BounceScrollView'

interface ScoreDetailDrawerContentProps {
  subject?: SubjectScore
}

const ScoreDetailDrawerContent: React.FC<
  ScoreDetailDrawerContentProps
> = props => {
  const store = useStore<ReducerTypes>()
  const [scoreData, setScoreData] = useState<ScoreDetails | null>(null)
  useEffect(() => {
    const { subject } = props
    if (subject) {
      setScoreData(null)
      getScoreDetail(
        store.getState().user.username!,
        subject.origin.jxb_id,
        subject.origin.xnm,
        subject.origin.xqm,
        subject.subjectName
      )
        .then(data => {
          setScoreData(data)
        })
        .catch(e =>
          NativeDialog.showDialog({
            title: '加载失败',
            message: e,
            hideCancelBtn: true,
          })
        )
        .finally(() => {
          // TODO show retry btn
        })
    }
  }, [props.subject])
  if (!scoreData) {
    return (
      <View
        style={{
          alignItems: 'center',
        }}>
        <View style={{ width: 300 }}>
          <ContentLoader
            speed={2}
            width={300}
            height={600}
            viewBox="0 0 300 600"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb">
            <Rect x="0" y="40" rx="3" ry="3" width="300" height="200" />
            <Rect x="0" y="260" rx="0" ry="0" width="300" height="300" />
          </ContentLoader>
        </View>
      </View>
    )
  } else if (props.subject) {
    return (
      <BounceScrollView>
        <View style={styles.drawerContainer}>
          <View>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.headerTitle}>
                {props.subject.subjectName}
              </Text>
            </View>
            <View style={styles.scoreContainer}>
              <View style={styles.rowContainer}>
                <View style={styles.rowItem}>
                  <Text style={styles.headerText}>成绩分项</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.headerText}>占比</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.headerText}>成绩</Text>
                </View>
              </View>
              {scoreData.map((value, index) => (
                <View style={styles.rowContainer} key={index}>
                  <View style={styles.rowItem}>
                    <Text style={styles.rowText}>{value.typeName}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.rowText}>{value.rate}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.rowText}>{value.score}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <View style={{ paddingHorizontal: 20 }}>
              <View style={styles.otherInfoTitleContainer}>
                <Text style={styles.otherInfoTitleText}>其它信息</Text>
              </View>
              <View>
                <TextBlock left="学分" right={props.subject.origin.xf} />
                <TextBlock left="课程性质" right={props.subject.type} />
                <TextBlock left="绩点" right={props.subject.origin.jd} />
                <TextBlock
                  left="成绩是否作废"
                  right={props.subject.origin.cjsfzf}
                />
                <TextBlock
                  left="开课学院"
                  right={props.subject.origin.kkbmmc}
                />
                <TextBlock left="成绩性质" right={props.subject.origin.ksxz} />
                <TextBlock
                  left="是否学位课程"
                  right={props.subject.origin.sfxwkc}
                />
                <TextBlock left="教学班" right={props.subject.origin.jxbmc} />
                <TextBlock left="任课教师" right={props.subject.teacherName} />
                <TextBlock
                  left="考核方式"
                  right={props.subject.origin.khfsmc}
                />
              </View>
            </View>
          </View>
        </View>
      </BounceScrollView>
    )
  } else {
    return <Text>Loading</Text>
  }
}
interface TextBlockProps {
  left: string
  right: string
}

const TextBlock: React.FC<TextBlockProps> = props => {
  return (
    <View style={styles.otherInfoContainer}>
      <Text style={styles.otherInfoLeftText}>{props.left}:</Text>
      <Text style={styles.otherInfoRightText}>{props.right}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: global.styles.$primary_color,
    fontSize: global.styles.$font_size_lg,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
  },
  scoreContainer: {
    borderRadius: 10,
    backgroundColor: '#f5f6fa',
    paddingVertical: 20,
    marginBottom: 20,
  },
  rowItem: {
    width: '33%',
    justifyContent: 'center',
    padding: 5,
  },
  headerText: {
    textAlign: 'center',
    color: global.styles.$text_color,
  },
  rowText: {
    textAlign: 'center',
    color: global.styles.$info_color,
  },
  otherInfoContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  otherInfoLeftText: {
    marginRight: global.styles.$spacing_row_sm,
    color: global.styles.$text_color,
  },
  otherInfoRightText: {
    color: global.styles.$info_color,
  },
  otherInfoTitleContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: global.styles.$border_color,
  },
  otherInfoTitleText: {
    color: global.styles.$primary_color,
    fontSize: global.styles.$font_size_base,
  },
})

export default ScoreDetailDrawerContent
