import React, { ReactNode } from 'react'
import { Dimensions, Text, View } from 'react-native'
import styles, { HEADER_HEIGHT, PER_CLASS_HEIGHT } from './styles'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../../redux/reducers'
import { ClassInfo } from '../../../redux/reducers/lessonsTable'
import { Link, useNavigation } from '@react-navigation/native'
import { LESSONS_DETAIL, RouterTypes, SCHOOL_AUTH } from '../../../router'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import TappableView from '../../../component/TappableView'

interface LessonsTableProps {}

const LessonsTable: React.FC<
  LessonsTableProps & StoreStates & StoreActions
> = props => {
  const deviceWidth = Dimensions.get('window').width
  const deviceHeight = Dimensions.get('window').height
  const perBlockWidth = deviceWidth / 8
  const nav = useNavigation<NavigationProp<RouterTypes>>()

  const seeLessonsDetail = (classInfo: ClassInfo) => {
    nav.navigate(LESSONS_DETAIL, {
      startTime: classInfo.beginTime,
      week: classInfo.week,
    })
  }

  /**
   * 计算当前课程的left值
   */
  const countLeftValue = (classInfo: ClassInfo) => {
    return classInfo.week * perBlockWidth
  }

  /**
   * 计算当前课程的top值
   */
  const countTopValue = (classInfo: ClassInfo) => {
    return classInfo.beginTime * PER_CLASS_HEIGHT + HEADER_HEIGHT
  }

  /**
   * 计算当前课程应该显示的高度
   */
  const countHeight = (classInfo: ClassInfo) => {
    return classInfo.duration * PER_CLASS_HEIGHT
  }

  /**
   * 渲染课程表, 一共有3种情况
   */
  const renderLessons = (): ReactNode => {
    if (!props.lessons) {
      return (
        <View style={{ height: deviceHeight }}>
          <Link to={`/${SCHOOL_AUTH}`} style={styles.linkText}>
            登录后再查看课表哦!
          </Link>
          <Text style={styles.tipText}>下拉可以刷新哦!</Text>
        </View>
      )
    } else if (props.lessons.length === 0) {
      return (
        <View style={{ height: deviceHeight }}>
          <Text style={styles.tipText}>当前设置下没有课程哦!</Text>
          <Text style={styles.tipText}>请检查当前设置</Text>
          <Text style={styles.tipText}>点击右上角齿轮可以进入设置</Text>
          <Text style={styles.tipText}>下拉可以刷新哦!</Text>
        </View>
      )
    } else {
      return (
        <View>
          <View>
            {props.lessons.map(value => (
              <TappableView
                style={[
                  styles.lessonItem,
                  {
                    left: countLeftValue(value),
                    top: countTopValue(value),
                  },
                ]}
                key={value.id + value.week}
                onTap={() => seeLessonsDetail(value)}>
                <View
                  style={{
                    height: countHeight(value),
                    width: perBlockWidth,
                    padding: 2,
                  }}>
                  <View style={[styles.lessonItemContainer]}>
                    <Text style={styles.lessonText}>
                      {value.className} @{value.location}
                    </Text>
                  </View>
                </View>
              </TappableView>
            ))}
          </View>
          <View style={styles.header}>
            <View style={[styles.sidebar, { width: perBlockWidth }]}>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>1</Text>
                <Text style={styles.sidebarText}>08:00</Text>
                <Text style={styles.sidebarText}>08:45</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>2</Text>
                <Text style={styles.sidebarText}>08:50</Text>
                <Text style={styles.sidebarText}>09:35</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>3</Text>
                <Text style={styles.sidebarText}>09:55</Text>
                <Text style={styles.sidebarText}>10:40</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>4</Text>
                <Text style={styles.sidebarText}>10:45</Text>
                <Text style={styles.sidebarText}>11:30</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>5</Text>
                <Text style={styles.sidebarText}>11:35</Text>
                <Text style={styles.sidebarText}>12:20</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>6</Text>
                <Text style={styles.sidebarText}>14:00</Text>
                <Text style={styles.sidebarText}>14:45</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>7</Text>
                <Text style={styles.sidebarText}>14:50</Text>
                <Text style={styles.sidebarText}>15:35</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>8</Text>
                <Text style={styles.sidebarText}>15:55</Text>
                <Text style={styles.sidebarText}>16:40</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>9</Text>
                <Text style={styles.sidebarText}>16:45</Text>
                <Text style={styles.sidebarText}>17:30</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>10</Text>
                <Text style={styles.sidebarText}>19:00</Text>
                <Text style={styles.sidebarText}>19:45</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>11</Text>
                <Text style={styles.sidebarText}>19:50</Text>
                <Text style={styles.sidebarText}>20:35</Text>
              </View>
              <View style={styles.sidebarBlock}>
                <Text style={styles.sidebarText}>12</Text>
                <Text style={styles.sidebarText}>20:40</Text>
                <Text style={styles.sidebarText}>21:35</Text>
              </View>
            </View>
            <Text style={[styles.headerText, { width: perBlockWidth }]}>
              星期一
            </Text>
            <Text style={[styles.headerText, { width: perBlockWidth }]}>
              星期二
            </Text>
            <Text style={[styles.headerText, { width: perBlockWidth }]}>
              星期三
            </Text>
            <Text style={[styles.headerText, { width: perBlockWidth }]}>
              星期四
            </Text>
            <Text style={[styles.headerText, { width: perBlockWidth }]}>
              星期五
            </Text>
            <Text style={[styles.headerText, { width: perBlockWidth }]}>
              星期六
            </Text>
            <Text style={[styles.headerText, { width: perBlockWidth }]}>
              星期日
            </Text>
          </View>
        </View>
      )
    }
  }

  return <View style={styles.lessonsTableContainer}>{renderLessons()}</View>
}

interface StoreStates {
  lessons?: Array<ClassInfo>
}

interface StoreActions {}

export default connect<
  StoreStates,
  StoreActions,
  LessonsTableProps,
  ReducerTypes
>(initialState => ({
  lessons: initialState.lessonsTable.lessons,
}))(LessonsTable)
