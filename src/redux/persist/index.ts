import { Storage } from 'redux-persist/es/types'
import MetaDataMapper from '../../sqlite/metadata'
import DatabaseManager from '../../sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLogger } from '../../utils/LoggerUtils'

const logger = getLogger('/redux/persist')

const SqliteStorage: Storage = {
  getItem: (key: string): Promise<string | null> => {
    if (DatabaseManager.isReady()) {
      return MetaDataMapper.getItem(key).catch(e => {
        logger.error('get item failed: ' + e.message)
        throw e
      })
    } else {
      return AsyncStorage.getItem(key)
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
}

export default SqliteStorage
