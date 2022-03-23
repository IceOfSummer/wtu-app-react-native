import { noRepeatAjax } from 'axios-simple-wrapper'
import { ClassInfo } from '../../../redux/reducers/lessonsTable'

export const getLessons = (
  username: string,
  year: number,
  term: 3 | 12
): Promise<Array<ClassInfo>> =>
  new Promise(resolve => {
    noRepeatAjax<object>(
      `http://jwglxt.wtu.edu.cn/kbcx/xskbcx_cxXsKb.html?gnmkdm=N2151&su=${username}`,
      {
        xnm: year,
        xqm: term,
        kzlx: 'ck',
      },
      'POST'
    ).then(resp => {
      const arr: Array<ClassInfo> = []
      // @ts-ignore
      const lessonsArr = resp.kbList as Array<any>
      lessonsArr.forEach(value => {
        const strDuration = value.jcs.toString().split('-')
        const start = Number.parseInt(strDuration[0], 10) - 1
        const end = Number.parseInt(strDuration[1], 10) - 1

        const weekDuration = value.zcd.toString().replace('周').split('-')
        const startWeek = Number.parseInt(weekDuration[0], 10)
        const endWeek = Number.parseInt(weekDuration[1], 10)
        arr.push({
          id: Number.parseInt(value.kch_id, 10),
          location: value.cdmc,
          week: Number.parseInt(value.xqj, 10),
          duration: end - start + 1,
          beginTime: start,
          className: value.kcmc,
          startWeek,
          endWeek,
        })
      })
      resolve(arr)
    })
  })
