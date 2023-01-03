import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../redux/counter'
import { renewToken } from '../../../api/server/auth'
import { modifyRequestToken } from '../../../redux/counter/serverUserSlice'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../../utils/LoggerUtils'

const logger = getLogger('/component/Container/ReLoginWrapper')

/**
 * 自动登录的wrapper
 */
const ReLoginWrapper: React.FC = props => {
  const [show, setShow] = useState(false)
  const store = useStore<ReducerTypes, any>()
  useEffect(() => {
    if (store.getState().serverUser.authenticated) {
      logger.info('trying to renew token')
      renewToken()
        .then(r => {
          logger.info('renew token success!')
          store.dispatch(modifyRequestToken(r.data))
        })
        .catch(e => {
          logger.info('renew token failed: ' + e.message)
          Toast.show('自动登录失败: ' + e.message)
        })
        .finally(() => {
          setShow(true)
        })
    } else {
      setShow(true)
    }
  }, [])
  if (show) {
    return <React.Fragment>{props.children}</React.Fragment>
  } else {
    return null
  }
}

export default ReLoginWrapper
