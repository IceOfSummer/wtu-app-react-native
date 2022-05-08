import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import {
  saveGlobalState,
  SaveGlobalStateFunctionType,
} from '../../../../redux/actions/temporaryData'
import { connect, useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/reducers'
import PrimaryButton from '../../../../component/Button/PrimaryButton'
import BounceScrollView from '../../../../native/component/BounceScrollView'
import {
  BaseQueryParam,
  ClassMark,
  getSubjectList,
  getSubjectQueryParam,
  selectClass,
  SubjectInfo,
  SubjectQueryParam,
} from '../../../../api/edu/subjectSelect'
import { SUBJECT_SELECT_STORAGE_KEY } from '../../index'
import { SUBJECT_QUERY_STORAGE_KEYS } from '../index'
import NativeDialog from '../../../../native/modules/NativeDialog'
import InitModal from '../../../../component/InitModal'
import Toast from 'react-native-toast-message'
import Accordion from 'react-native-collapsible/Accordion'
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
  const [isLoading, setLoading] = useState(false)
  const store = useStore<ReducerTypes>()
  const params = store.getState() as unknown as TemporaryData

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
    setLoading(true)
    getSubjectQueryParam(
      props.username,
      props.classMark,
      params[SUBJECT_SELECT_STORAGE_KEY]
    )
      .then(resp => {
        props.saveGlobalState({
          [props.storageKey]: resp,
        })
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
        setLoading(false)
      })
  }

  useEffect(() => {
    const queryParam = params[props.storageKey]

    if (queryParam) {
      // load
      loadQueryParam()
    } else {
      setInitSuccess()
    }
  }, [])

  const [subjectList, setSubjectList] = useState<Array<SubjectInfo>>([])
  const [activeSubject, setActiveSubject] = useState<Array<number>>([])
  const nextPage = useRef(1)
  /**
   * 加载可选课程
   */
  const loadSubjects = () => {
    if (params[props.storageKey]) {
      setLoading(true)
      getSubjectList(
        props.username,
        props.classMark,
        params[SUBJECT_SELECT_STORAGE_KEY],
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
          setLoading(false)
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

  const renderHeader = (subject: SubjectInfo) => {
    return (
      <View>
        <Text>{subject.kcmc}</Text>
      </View>
    )
  }

  const RenderContent = (subject: SubjectInfo) => {
    const [disabled, setDisabled] = useState(false)
    const selectCurrentClass = () => {
      setLoading(true)
      selectClass(
        props.username,
        props.classMark,
        params[SUBJECT_SELECT_STORAGE_KEY],
        // 不加载该数据无法到达这步
        params[props.storageKey]!,
        subject
      )
        .then(() => {
          Toast.show({
            text1: '选课成功',
            text2: '请不要重复选课',
          })
          setDisabled(true)
        })
        .catch(e => {
          Toast.show({
            text1: '选课失败',
            text2: e,
          })
        })
        .finally(() => {
          setLoading(false)
        })
    }
    // load info
    return (
      <View>
        <Text>{subject.kcmc}</Text>
        <Button onPress={selectCurrentClass} disabled={disabled}>
          选课
        </Button>
      </View>
    )
  }

  const onChange = (selected: number[]) => {
    setActiveSubject(activeSubject.concat(selected))
  }

  if (isInitFail) {
    return (
      <Pressable onPress={() => loadQueryParam()}>
        <InitModal visible={isLoading} />
        <Text
          style={{
            color: global.styles.$error_color,
            fontSize: global.styles.$font_size_base,
          }}>
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
        <InitModal visible={isLoading} />
        <BounceScrollView enablePureScrollMode>
          <View>Content</View>
          <Accordion
            sections={subjectList}
            renderHeader={renderHeader}
            renderContent={RenderContent}
            activeSections={activeSubject}
            onChange={onChange}
          />
          <PrimaryButton title="加载可选课程" onPress={loadSubjects} />
        </BounceScrollView>
      </View>
    )
  }
}

// const ClassInfoBlock: React.FC<SubjectInfo> = props => {
//   return (
//     <Accordion onChange={}>
//       <Text>{props.kcmc}</Text>
//       <Text>{props.}</Text>
//     </Accordion>
//   )
// }

type OwnSelectParam = Partial<
  Partial<Record<SUBJECT_QUERY_STORAGE_KEYS, SubjectQueryParam | undefined>>
>

interface TemporaryData extends OwnSelectParam {
  [SUBJECT_SELECT_STORAGE_KEY]: BaseQueryParam
}

interface StoreState {
  // params: TemporaryData
  username: string
}

interface StoreAction {
  saveGlobalState: SaveGlobalStateFunctionType<OwnSelectParam>
}

export default connect<StoreState, StoreAction, ClassListProps, ReducerTypes>(
  initialState => ({
    username: initialState.user.username!,
    // params: initialState.temporary.globalStates,
  }),
  {
    saveGlobalState,
  }
)(SubjectList)
