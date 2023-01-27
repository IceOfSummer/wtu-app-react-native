import { useRef, useState } from 'react'
import { ResponseTemplate } from '../../api/server/types'

type LoadData<T> = (
  page: number,
  size: number
) => Promise<ResponseTemplate<T[]>>

/**
 * 使用分页管理
 * @param fun ajax请求函数
 * @param size 每页的大小
 * @param loadOnce 是否只加载一次
 */
const usePage = <T>(fun: LoadData<T>, size: number, loadOnce?: boolean) => {
  const curPage = useRef(1)
  const [data, setData] = useState<T[]>([])
  const [empty, setEmpty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  return {
    empty,
    data,
    loading,
    error,
    setData,
    loadMore: async () => {
      if (loading) {
        return
      }
      if (loadOnce && data.length > 0) {
        return
      }
      try {
        setLoading(true)
        const result = await fun(curPage.current, size)
        curPage.current++
        setError(false)
        if (result.data.length < size) {
          setEmpty(true)
        }
        setData(data.concat(result.data))
      } catch (e) {
        setError(true)
        throw e
      } finally {
        setLoading(false)
      }
    },
  }
}

export default usePage
