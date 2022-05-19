import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { saveGlobalState } from '../../../../redux/actions/temporaryData'
import { connect, useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/reducers'
import PrimaryButton from '../../../../component/Button/PrimaryButton'
import BounceScrollView from '../../../../native/component/BounceScrollView'
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
import { S_S_GLOBAL_PREFIX, S_S_K_BASE_QUERY } from '../../index'
import {
  S_S_ELECTIVES_S_K,
  S_S_ENGLISH_S_K,
  S_S_PE_S_K,
  SUBJECT_QUERY_STORAGE_KEYS,
} from '../index'
import NativeDialog from '../../../../native/modules/NativeDialog'
import Toast from 'react-native-toast-message'
import AutoCollapsible from '../../../../component/AutoCollapsible'
import Loading from '../../../../component/Loading'
import Button from 'react-native-button'

interface ClassListProps {
  classMark: ClassMark
  storageKey: SUBJECT_QUERY_STORAGE_KEYS
}

const SubjectList: React.FC<
  ClassListProps & StoreState & StoreAction
> = props => {
  const [isInitDone, setInitDone] = useState(false)
  const [isInitFail, setInitFail] = useState(false)
  const store = useStore<ReducerTypes>()
  const params = (
    store.getState().temporary.globalStates as unknown as TemporaryData
  )[S_S_GLOBAL_PREFIX]

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
    getSubjectQueryParam(
      props.username,
      props.classMark,
      params[S_S_K_BASE_QUERY]
    )
      .then(resp => {
        store.dispatch(
          saveGlobalState({
            [S_S_GLOBAL_PREFIX]: {
              [props.storageKey]: resp,
            },
          })
        )
        // props.saveGlobalState({
        //   [props.storageKey]: resp,
        // })
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
    const queryParam = params[props.storageKey]
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
    if (params[props.storageKey]) {
      Loading.showLoading('加载课程中')
      getSubjectList(
        props.username,
        props.classMark,
        params[S_S_K_BASE_QUERY],
        params[props.storageKey]!,
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
        <BounceScrollView enablePureScrollMode>
          <View style={{ paddingBottom: 150 }}>
            {subjectList.map((value, index) => (
              <SubjectCollapsible
                key={index}
                info={value}
                username={props.username}
                baseQueryParam={params[S_S_K_BASE_QUERY]}
                mark={props.classMark}
                queryParam={params[props.storageKey]!}
              />
            ))}
            <PrimaryButton
              title={subjectList.length === 0 ? '加载可选课程' : '加载更多'}
              onPress={loadSubjects}
            />
          </View>
        </BounceScrollView>
      </View>
    )
  }
}

export const SUBJECT_CACHE_PREFIX = 'SubjectSelectCache'
/**
 * 课程折叠筐
 */
const SubjectCollapsible: React.FC<{
  info: SubjectInfo
  username: string
  baseQueryParam: BaseQueryParam
  mark: ClassMark
  queryParam: SubjectQueryParam
}> = props => {
  const [lockSelectButton, setLockSelectButton] = useState(true)
  const [detail, setDetail] = useState<SubjectDetail>()
  const [isLoadFail, setLoadFail] = useState(false)
  const store = useStore<ReducerTypes>()

  useEffect(() => {
    const detailCache = store.getState().temporary.globalStates[
      SUBJECT_CACHE_PREFIX
    ]?.[props.info.kch_id] as SubjectDetail
    if (detailCache != null) {
      setDetail(detailCache)
    }
  }, [])

  function loadSubjectDetail() {
    Loading.showLoading('加载详细信息中')
    getSubjectDetail(
      props.username,
      props.mark,
      props.baseQueryParam,
      props.queryParam,
      props.info
    )
      .then(resp => {
        setLoadFail(false)
        setDetail(resp)
        // 临时保存
        store.dispatch(
          saveGlobalState({
            [SUBJECT_CACHE_PREFIX]: {
              [props.info.kch_id]: resp,
            },
          })
        )
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
      props.mark,
      props.baseQueryParam,
      props.queryParam,
      props.info
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

interface TemporaryData {
  [S_S_GLOBAL_PREFIX]: {
    [S_S_K_BASE_QUERY]: BaseQueryParam
    [S_S_ELECTIVES_S_K]?: SubjectQueryParam
    [S_S_ENGLISH_S_K]?: SubjectQueryParam
    [S_S_PE_S_K]?: SubjectQueryParam
  }
  /**
   * 每项课程的单独缓存
   */
  [SUBJECT_CACHE_PREFIX]?: Record<string, object>
}

interface StoreState {
  // params: TemporaryData
  username: string
}

interface StoreAction {}

export default connect<StoreState, StoreAction, ClassListProps, ReducerTypes>(
  initialState => ({
    username: initialState.user.username!,
    // params: initialState.temporary.globalStates,
  }),
  {
    saveGlobalState,
  }
)(SubjectList)
