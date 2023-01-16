import { Storage } from 'redux-persist/es/types'
import MetaDataMapper from '../../sqlite/metadata'
import DatabaseManager from '../../sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLogger } from '../../utils/LoggerUtils'

const logger = getLogger('/redux/persist')

interface SqliteStorageType extends Storage {
  /**
   * 订阅某个getItem(key)事件，当成功获取相关值时触发回调(仅会触发一次，无需手动取消)
   * @param key 持久化key
   * @param callback 回调
   */
  subscribe: (key: string, callback: () => void) => void
}

function getPubsubKey(key: string) {
  return 'redux/persist:' + key
}

const SqliteStorage: SqliteStorageType = {
  getItem: async (key: string): Promise<string | null> => {
    let value: string | null
    try {
      if (DatabaseManager.isReady()) {
        value = await MetaDataMapper.getItem(key)
      } else {
        value = await AsyncStorage.getItem(key)
      }
      PubSub.publish(getPubsubKey(key))
      return value
    } catch (e: any) {
      logger.error('get item failed: ' + e.message)
      throw e
    }
  },

  removeItem: (key: string) => {
    if (DatabaseManager.isReady()) {
      return MetaDataMapper.removeItem(key).catch(e => {
        logger.error('remove item failed: ' + e.message)
        throw e
      })
    } else {
      return AsyncStorage.removeItem(key)
    }
  },

  setItem: (key: string, value: string) => {
    if (DatabaseManager.isReady()) {
      return MetaDataMapper.setItem(key, value).catch(e => {
        logger.error('set item failed: ' + e.message)
        throw e
      })
    } else {
      return AsyncStorage.setItem(key, value)
    }
  },

  subscribe: (key, callback) => {
    PubSub.subscribeOnce(getPubsubKey(key), callback)
  },
}

export default SqliteStorage
