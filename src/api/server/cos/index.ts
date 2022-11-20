import { serverNoRepeatAjax } from '../../request'
import { quickShowErrorTip } from '../../../native/modules/NativeDialog'
import COS from 'cos-nodejs-sdk-v5'
import config from '../../../../config.json'

type AccessKey = {
  credentials: {
    tmpSecretId: string
    tmpSecretKey: string
    sessionToken: string
  }
  requestId: string
  expiration: string
  startTime: number
  expiredTime: number
}

const getCosAccessKey = () => serverNoRepeatAjax<AccessKey>('/cos/key')

const cos = new COS({
  getAuthorization(options, callback) {
    getCosAccessKey()
      .then(({ data }) => {
        callback({
          TmpSecretKey: data.credentials.tmpSecretKey,
          TmpSecretId: data.credentials.tmpSecretId,
          SecurityToken: data.credentials.sessionToken,
          ExpiredTime: data.expiredTime,
          StartTime: data.startTime,
        })
      })
      .catch(e => {
        quickShowErrorTip('获取密匙失败', e.message)
      })
  },
})

export const putObject = (body: string, path: string) => {
  cos.putObject(
    {
      Bucket: config.common.bucket,
      Region: config.common.region,
      Key: path,
      Body: body,
    },
    (err, data) => {
      console.log(err || data)
    }
  )
}
export default cos
