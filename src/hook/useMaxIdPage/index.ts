import { ResponseTemplate } from '../../api/server/types'
import { useRef, useState } from 'react'
import { getLogger } from '../../utils/LoggerUtils'

const logger = getLogger('/hook/useMaxIdPage')

type LoadData<T> = (
  maxId?: number,
  size?: number
) => Promise<ResponseTemplate<T[]>>

const useMaxIdPage = <T>(
  fun: LoadData<T>,
  getId: (value: T) => number,
  size: number = 8
) => {
  const maxId = useRef<number | undefined>()
  const [data, setData] = useState<T[]>([])
  const [allLoaded, setAllLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const loadData = async (refresh?: boolean) => {
    if (loading || (allLoaded && !refresh)) {
      logger.debug(
        `skip request, loading = ${loading}, allLoaded = ${allLoaded}, refresh = ${refresh}`
      )
      return
    }
    logger.info(`loading data. maxId = ${maxId.current}, refresh = ${refresh}`)
    if (refresh) {
      setAllLoaded(false)
      maxId.current = undefined
    }
    setLoading(true)
    try {
      const result = await fun(maxId.current, size)
      if (result.data.length < size) {
        setAllLoaded(true)
        console.log(result.data.length, size, result.data.length < size)
      }
      console.log(result.data, result.data.length, size)
      let mxId = 1e9
      result.data.forEach(value => {
        mxId = Math.min(mxId, getId(value))
      })
      console.log(maxId.current)
      maxId.current = mxId
      console.log(maxId.current)
      if (refresh) {
        setData(result.data)
      } else {
        setData(data.concat(result.data))
      }
    } catch (e: any) {
      logger.error('load data filed: ' + e.message)
      setError(true)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    allLoaded,
    loading,
    error,
    setData,
    next: () => loadData(),
    refresh: () => {
      setData([])
      return loadData(true)
    },
  }
}

export default useMaxIdPage
