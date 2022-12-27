import LoadingView from '../LoadingView'
import { ResponseTemplate } from '../../../api/server/types'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { quickShowErrorTip } from '../../../native/modules/NativeDialog'
import { ViewStyle } from 'react-native'

interface EnhancedLoadingViewProps<T> extends PropsWithChildren<{}> {
  loadData: () => Promise<ResponseTemplate<T>>
  setData: (data: T) => void
  style?: ViewStyle
}

/**
 * 全面接管加载阶段，当渲染props.children时，请求一定是成功的(code非0)
 */
function EnhancedLoadingView<T>(props: EnhancedLoadingViewProps<T>) {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const loadData = () => {
    setLoading(true)
    props
      .loadData()
      .then(resp => {
        if (resp.data) {
          props.setData(resp.data)
        }
        setSuccess(true)
      })
      .catch(e => {
        quickShowErrorTip('请求失败', e.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <LoadingView
      loadCallback={loadData}
      success={success}
      isLoading={loading}
      style={props.style}>
      {props.children}
    </LoadingView>
  )
}

export default EnhancedLoadingView
