import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { modifyCommonOptions } from '../../redux/actions/commonOptions'
import { connect, useStore } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import {
  saveGlobalState,
  SaveGlobalStateFunctionType,
} from '../../redux/actions/temporaryData'
import Tabs from './Tabs'
import SubjectSelectTip from './SubjectSelectTip'
import FullScreenDialog, {
  FullScreenDialogRefAttribute,
} from '../../native/component/FullScreenDialog'
import { BaseQueryParam, getBaseQueryParam } from '../../api/edu/subjectSelect'
import NativeDialog from '../../native/modules/NativeDialog'

/**
 * 基础参数在redux#GlobalState存储的key
 */
export const S_S_K_BASE_QUERY = 'SubjectSelectBaseQueryParam'
/**
 * 使用redux的prefix前缀
 */
export const S_S_GLOBAL_PREFIX = 'subjectSelect'

const SubjectSelectPage: React.FC<StoreStates & StoreActions> = props => {
  const layout = useWindowDimensions()
  const [isInitDone, setInitDone] = useState(false)
  const [isLoadingFail, setLoadingFail] = useState(false)

  /**
   * 加载初始化参数
   */
  function loadInitParam() {
    getBaseQueryParam(props.username)
      .then(resp => {
        props.saveGlobalState({
          [S_S_GLOBAL_PREFIX]: {
            [S_S_K_BASE_QUERY]: resp,
          },
        })
        console.log(resp)
        setInitSuccess()
      })
      .catch(e => {
        NativeDialog.showDialog({
          title: '初始化失败',
          message: e,
          confirmBtnText: '重试',
          onConfirm() {
            loadInitParam()
          },
          onCancel() {
            setLoadingFail(true)
          },
        })
      })
  }

  /**
   * 设置初始化成功
   */
  function setInitSuccess() {
    setInitDone(true)
    if (isLoadingFail) {
      setLoadingFail(false)
    }
  }

  useEffect(() => {
    if (props.queryParam) {
      setInitSuccess()
    } else {
      loadInitParam()
    }
  }, [])

  const retryInit = () => {
    setLoadingFail(false)
    loadInitParam()
  }

  if (isLoadingFail) {
    return (
      <Pressable onPress={retryInit}>
        <Text style={global.styles.errorTipText}>加载失败, 点我重试</Text>
      </Pressable>
    )
  }
  if (!isInitDone) {
    return (
      <View style={{ marginTop: 10 }}>
        <ActivityIndicator color={global.styles.$primary_color} size={25} />
        <Text style={global.styles.primaryTipText}>加载中</Text>
      </View>
    )
  } else {
    return (
      <View style={{ height: layout.height }}>
        <Tabs />
      </View>
    )
  }
}

type GlobalState = {
  [S_S_GLOBAL_PREFIX]: {
    [S_S_K_BASE_QUERY]?: BaseQueryParam
  }
}

interface StoreStates {
  autoShowTips: boolean
  queryParam?: BaseQueryParam
  username: string
}

interface StoreActions {
  modifyCommonOptions: (...args: Parameters<typeof modifyCommonOptions>) => void
  saveGlobalState: SaveGlobalStateFunctionType<GlobalState>
}

const Content = connect<StoreStates, StoreActions, {}, ReducerTypes>(
  initialState => ({
    autoShowTips: !initialState.commonOptions.autoHideSubjectSelectPageTips,
    queryParam: initialState.temporary.globalStates[S_S_GLOBAL_PREFIX]
      ? initialState.temporary.globalStates[S_S_GLOBAL_PREFIX][S_S_K_BASE_QUERY]
      : null,
    username: initialState.user.username!,
  }),
  {
    modifyCommonOptions,
    saveGlobalState: saveGlobalState,
  }
)(SubjectSelectPage)

const PageContainer: React.FC = () => {
  const layout = useWindowDimensions()
  const fullScreenDialog = useRef<FullScreenDialogRefAttribute>(null)
  const store = useStore<ReducerTypes>()

  const onConfirm = () => {
    store.dispatch(modifyCommonOptions({ autoHideSubjectSelectPageTips: true }))
    // props.modifyCommonOptions({ autoHideSubjectSelectPageTips: true })
  }
  useEffect(() => {
    setTimeout(() => {
      if (!store.getState().commonOptions.autoHideSubjectSelectPageTips) {
        fullScreenDialog.current?.open()
      }
    }, 2000)
  }, [])

  return (
    <View style={{ height: layout.height }}>
      <Content />
      <FullScreenDialog
        uniqueId="SubjectSelectTip1"
        showButton
        buttonText="我已知晓, 不再提醒"
        ref={fullScreenDialog}
        onConfirm={onConfirm}>
        <SubjectSelectTip />
      </FullScreenDialog>
    </View>
  )
}
export default PageContainer
