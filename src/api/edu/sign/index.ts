import { wtuNoRepeatAjax } from '../../request'

/**
 * 获取上次打卡时间
 */
export const getLastSignInfo = () =>
  new Promise<Date | null>((resolve, reject) => {
    wtuNoRepeatAjax<any>(
      'http://ehall.wtu.edu.cn/qljfwapp/sys/lwWtuPassCodeSchool/modules/report/listRecordData.do',
      {
        appName: 'lwWtuPassCodeSchool',
        page: 'report',
        action: 'listRecordData',
        pageNumber: 1,
        pageSize: 1,
      },
      'POST'
    )
      .then(resp => {
        try {
          if (resp.datas.listRecordData.rows.length === 0) {
            resolve(null)
          }
          // 2022-04-09 00:06:14.751
          const signTimeStr = resp.datas.listRecordData.rows[0].dksj as string
          const REGX = /\d+/g
          const match = signTimeStr.match(REGX) as RegExpMatchArray
          resolve(
            new Date(
              Number(match[0]),
              Number(match[1]) - 1,
              Number(match[2]),
              Number(match[3]),
              Number(match[4]),
              Number(match[5]),
              Number(match[6])
            )
          )
        } catch (e) {
          // 空指针
          reject('请求失败')
        }
      })
      .catch(reject)
  })
