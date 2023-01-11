import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { connect } from 'react-redux'
import {
  BaseQueryParam,
  ClassMark,
  getSubjectDetail,
  getSubjectList,
  getSubjectQueryParam,
  selectSubject,
  SubjectDetail,
  SubjectInfo,
  SubjectQueryParam,
} from '../../../../api/edu/subjectSelect'
import NativeDialog from '../../../../native/modules/NativeDialog'
import Toast from 'react-native-toast-message'
import AutoCollapsible from '../../../../component/AutoCollapsible'
import Loading from '../../../../component/Loading'
import Button from 'react-native-button'
import useGlobalState from '../../useGlobalState'
import ColorfulButton from '../../../../component/Button/ColorfulButton'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { ReducerTypes } from '../../../../redux/counter'

interface ClassListProps {
  classMark: ClassMark
  storageKey: string
}

const SubjectList: React.FC<ClassListProps & StoreState> = props => {
  const [isInitDone, setInitDone] = useState(false)
  const [isInitFail, setInitFail] = useState(false)
  const globalState = useGlobalState()
  const baseQueryParam = globalState.getBaseQueryParam()
  /**
   * 设置初始化成功
   */
  function setInitSuccess() {
    setInitDone(true)
    if (isInitFail) {
      setInitFail(false)
    }
  }

  /**
   * 加载数据
   */
  function loadQueryParam() {
    Loading.showLoading('初始化中')
    getSubjectQueryParam(props.username, props.classMark, baseQueryParam)
      .then(resp => {
        globalState.setSubjectQueryParam(props.storageKey, resp)
        setInitSuccess()
      })
      .catch(e => {
        NativeDialog.showDialog({
          title: '加载失败',
          message: e,
          confirmBtnText: '重试',
          onConfirm() {
            loadQueryParam()
          },
          onCancel() {
            setInitFail(true)
          },
        })
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  useEffect(() => {
    const queryParam = globalState.getSubjectQueryParam(props.storageKey)
    if (queryParam) {
      // load
      setInitSuccess()
    } else {
      loadQueryParam()
    }
  }, [])

  const [subjectList, setSubjectList] = useState<Array<SubjectInfo>>([])
  const nextPage = useRef(1)
  /**
   * 加载可选课程
   */
  const loadSubjects = () => {
    const queryParam = globalState.getSubjectQueryParam(props.storageKey)
    if (queryParam) {
      Loading.showLoading('加载课程中')
      getSubjectList(
        props.username,
        props.classMark,
        queryParam,
        baseQueryParam,
        nextPage.current
      )
        .then(resp => {
          if (resp.length === 0) {
            Toast.show({
              text1: '没有更多数据了',
            })
            return
          }
          nextPage.current++
          setSubjectList(subjectList.concat(resp))
        })
        .catch(e => {
          NativeDialog.showDialog({
            title: '加载失败',
            message: e,
            hideCancelBtn: true,
          })
        })
        .finally(() => {
          Loading.hideLoading()
        })
    } else {
      NativeDialog.showDialog({
        title: '初始化失败',
        message: '是否重试',
        onConfirm() {
          loadQueryParam()
        },
        onCancel() {
          setInitFail(true)
        },
      })
    }
  }

  if (isInitFail) {
    return (
      <Pressable onPress={() => loadQueryParam()}>
        <Text style={[global.styles.errorTipText, global.styles.centerText]}>
          加载失败, 点我重试
        </Text>
      </Pressable>
    )
  } else if (!isInitDone) {
    return (
      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <ActivityIndicator color={global.styles.$primary_color} />
        <Text style={global.styles.primaryTipText}>加载中..</Text>
      </View>
    )
  } else {
    return (
      <View>
        <SpringScrollView>
          <View style={{ paddingBottom: 150 }}>
            {subjectList.map((value, index) => (
              <SubjectCollapsible
                key={index}
                info={value}
                username={props.username}
                baseQueryParam={baseQueryParam}
                mark={props.classMark}
                queryParam={globalState.getSubjectQueryParam(props.storageKey)}
              />
            ))}
            <View style={{ paddingHorizontal: 50, marginTop: 20 }}>
              <ColorfulButton
                color={global.colors.primaryColor}
                title={subjectList.length === 0 ? '加载可选课程' : '加载更多'}
                onPress={loadSubjects}
              />
            </View>
          </View>
        </SpringScrollView>
      </View>
    )
  }
}

/**
 * 课程折叠筐
 */
const SubjectCollapsible: React.FC<{
  info: SubjectInfo
  username: string
  baseQueryParam?: BaseQueryParam
  mark: ClassMark
  queryParam?: SubjectQueryParam
}> = props => {
  const [lockSelectButton, setLockSelectButton] = useState(false)
  const [detail, setDetail] = useState<SubjectDetail>()
  const [isLoadFail, setLoadFail] = useState(false)
  // 选课必备参数
  const jxbIds = useRef('')

  function loadSubjectDetail() {
    Loading.showLoading('加载详细信息中')
    getSubjectDetail(
      props.username,
      props.mark,
      props.info,
      props.queryParam,
      props.baseQueryParam
    )
      .then(resp => {
        setLoadFail(false)
        setDetail(resp)
        jxbIds.current = resp.origin.do_jxb_id
      })
      .catch(e => {
        NativeDialog.showDialog({
          title: '加载失败',
          message: e,
          confirmBtnText: '重试',
          onConfirm() {
            loadSubjectDetail()
          },
          onCancel() {
            setLoadFail(true)
          },
        })
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  const onFirstOpen = () => {
    if (!detail) {
      loadSubjectDetail()
    }
  }

  const selectCurrentSubject = () => {
    Loading.showLoading()
    selectSubject(
      props.username,
      jxbIds.current,
      props.mark,
      props.info,
      props.queryParam,
      props.baseQueryParam
    )
      .then(() => {
        NativeDialog.showDialog({
          title: '选课成功',
          message: '请不要重复选课。 若要取消选课, 请前往教务系统修改!',
          hideCancelBtn: true,
        })
        setLockSelectButton(true)
      })
      .catch(e => {
        NativeDialog.showDialog({
          title: '选课失败',
          message: e,
          confirmBtnText: '重试',
          onConfirm() {
            selectCurrentSubject()
          },
        })
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  return (
    <AutoCollapsible headerText={props.info.kcmc} onFirstOpen={onFirstOpen}>
      <View style={{ height: 80 }}>
        {detail && !isLoadFail ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <View>
              <View style={global.styles.flexRow}>
                <Text style={global.styles.textContent}>任课教师: </Text>
                <Text
                  style={[
                    global.styles.textContent,
                    { color: global.styles.$info_color },
                  ]}>
                  {detail.teacher}
                </Text>
              </View>
              <View style={global.styles.flexRow}>
                <Text style={global.styles.textContent}>上课时间: </Text>
                <Text
                  style={[
                    global.styles.textContent,
                    { color: global.styles.$info_color },
                  ]}>
                  {detail.time}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  color:
                    detail.maxCount > props.info.yxzrs ? '#007aff' : '#dd524d',
                }}>
                已选:{props.info.yxzrs}/{detail.maxCount}
              </Text>
              <Button
                onPress={selectCurrentSubject}
                disabled={lockSelectButton}
                disabledContainerStyle={{
                  backgroundColor: '#007aff60',
                }}
                containerStyle={{
                  backgroundColor: global.styles.$primary_color,
                  padding: 5,
                  borderRadius: 20,
                  marginTop: 5,
                  overflow: 'hidden',
                }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                  {lockSelectButton ? '已选' : '选课'}
                </Text>
              </Button>
            </View>
          </View>
        ) : null}
        {isLoadFail ? (
          <Pressable onPress={loadSubjectDetail}>
            <Text
              style={[global.styles.centerText, global.styles.errorTipText]}>
              加载失败, 点我重试
            </Text>
          </Pressable>
        ) : null}
        {!detail && !isLoadFail ? (
          <Text
            style={[global.styles.centerText, global.styles.primaryTipText]}>
            加载中
          </Text>
        ) : null}
      </View>
    </AutoCollapsible>
  )
}

interface StoreState {
  // params: TemporaryData
  username: string
}

export default connect<StoreState, {}, ClassListProps, ReducerTypes>(
  initialState => ({
    username: initialState.user.username!,
    // params: initialState.temporary.globalStates,
  })
)(SubjectList)
