import { useState } from 'react'

/**
 * 强制刷新页面
 */
const useForceUpdate = () => {
  const [update, setUpdate] = useState(false)
  return () => {
    setUpdate(!update)
  }
}
export default useForceUpdate
