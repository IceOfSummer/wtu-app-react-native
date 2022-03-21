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
        arr.push({
          location: value.cdmc,
          week: value.xqj,
          duration: end - start + 1,
          beginTime: start,
          className: value.kcmc,
        })
      })
      resolve(arr)
    })
  })
