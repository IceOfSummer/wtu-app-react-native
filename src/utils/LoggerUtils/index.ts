import { consoleTransport, fileAsyncTransport, logger } from 'react-native-logs'
import { append0Prefix } from '../DateUtils'
import fs from 'react-native-fs'
import { configLoggerType } from 'react-native-logs/src/'
function getDayStr(time: number) {
  const date = new Date(time)
  return `${date.getFullYear()}-${append0Prefix(
    date.getMonth() + 1
  )}-${append0Prefix(date.getDate())}`
}

const PATH_PREFIX = fs.ExternalDirectoryPath
const CURRENT_DAY_STR = getDayStr(Date.now())
const BASE_URL = `${PATH_PREFIX}/logs`

const loggerConfig: configLoggerType = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? 'debug' : 'info',
  transport: [consoleTransport, fileAsyncTransport],
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
      debug: 'greenBright',
    },
    FS: fs,
    filePath: PATH_PREFIX,
    fileName: 'logs/' + getLogName(),
  },
}
const LOGGER = logger.createLogger(loggerConfig)

function getLogName(day = CURRENT_DAY_STR) {
  return `wtu-app-log ${day}.txt`
}

export function getLogPath(logName = getLogName()) {
  return `${BASE_URL}/${logName}`
}

/**
 * 初始化logger
 */
// eslint-disable-next-line no-extra-semi
;(function () {
  fs.exists(PATH_PREFIX + '/logs').then(ex => {
    if (!ex) {
      fs.mkdir(PATH_PREFIX + '/logs').catch(e => console.error(e))
    }
    fs.exists(getLogPath()).then(exi => {
      if (!exi) {
        fs.writeFile(getLogPath(), '', 'utf8').catch(e =>
          console.log('create log fail: ' + e)
        )
      }
    })
  })
  removeExpiredLog(30)
})()

export const getLogger = (namespace: string) => {
  return LOGGER.extend(namespace)
}

export const getLogFiles = () => {
  return fs.readdir(BASE_URL)
}

function removeLog(filename: string) {
  fs.exists(filename)
    .then(ex => {
      if (ex) {
        fs.unlink(filename)
          .then(() => {
            console.log('remove expired log: ' + filename)
          })
          .catch(e => {
            console.log('remove fail: ' + e)
          })
      }
    })
    .catch(e => {
      console.log(`remove ${filename} failed: ${e}`)
    })
}
function removeExpiredLog(day: number) {
  console.log('removing expired log')
  const daySt = getDayStr(Date.now() - day * 1000 * 60 * 60 * 24)
  removeLog(getLogPath(getLogName(daySt)))
}
