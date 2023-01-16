import { useRef, useState } from 'react'
import { CombinedEventRemind } from '../../../api/server/event_remind'
import EventRemindMapper, { AbstractType } from '../../../sqlite/event_remind'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../../utils/LoggerUtils'

const logger = getLogger('/views/MessageTipPage/hook/useHistoryRemind')

const SIZE = 5
const useHistoryRemind = (
  type: AbstractType,
  distinctArray: CombinedEventRemind[]
) => {
  const [data, setData] = useState<CombinedEventRemind[]>([])
  const [empty, setEmpty] = useState(false)
  // 去重标志
  const flag = useRef(false)
  const currentPage = useRef(1)
  const loadData = () => {
    if (empty) {
      return
    }
    return EventRemindMapper.selectEventReminds(type, currentPage.current, SIZE)
      .then(r => {
        if (r.length < SIZE) {
          setEmpty(true)
        }
        if (flag.current) {
          setData(data.concat(r))
        } else {
          const disArr: CombinedEventRemind[] = []
          r.forEach(value => {
            if (!distinctArray.find(v => value.id === v.id)) {
              disArr.push(value)
            }
          })
          if (disArr.length === r.length) {
            flag.current = true
          }
          setData(data.concat(disArr))
        }
      })
      .catch(e => {
        Toast.show('加载历史消息失败: ' + e.message)
        logger.error('load event remind failed: ' + e.message)
      })
  }

  return {
    loadData,
    data,
    empty,
  }
}

export default useHistoryRemind
