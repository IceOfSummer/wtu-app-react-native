import {
  ClassInfo,
  ClassWeekDuration,
  Term,
} from '../../../redux/types/lessonsTableTypes'
import { wtuNoRepeatAjax } from '../../request'

export const getLessons = (
  username: string,
  year: number,
  term: 3 | 12
): Promise<Array<ClassInfo>> =>
  new Promise((resolve, reject) => {
    wtuNoRepeatAjax<object>(
      `http://jwglxt.wtu.edu.cn/kbcx/xskbcx_cxXsKb.html?gnmkdm=N2151&su=${username}#test`,
      {
        xnm: year,
        xqm: term,
        kzlx: 'ck',
      },
      'POST'
    )
      .then(resp => {
        const arr: Array<ClassInfo> = []
        // @ts-ignore
        const lessonsArr = resp.kbList as Array<any>
        lessonsArr.forEach(value => {
          const strDuration = value.jcs.toString().split('-')
          const start = Number.parseInt(strDuration[0], 10) - 1
          const end = Number.parseInt(strDuration[1], 10) - 1

          const teacher = value.xm
          const contains = value.kcxszc
          const examType = value.khfsmc
          const lessonsType = value.kcxz

          arr.push({
            id: value.kch_id,
            location: value.cdmc,
            week: Number.parseInt(value.xqj, 10),
            duration: end - start + 1,
            beginTime: start,
            className: value.kcmc,
            weekInfo: splitWeekInfo(value.zcd),
            teacher,
            contains,
            examType,
            lessonsType,
            origin: {
              zcd: value.zcd,
            },
          })
        })
        resolve(arr)
      })
      .catch(reject)
  })

function splitWeekInfo(scd: string): Array<ClassWeekDuration> {
  const split = scd.split(',')
  const arr: Array<ClassWeekDuration> = []
  split.forEach(value => {
    const temp = value.split('-')
    arr.push({
      startWeek: Number.parseInt(temp[0], 10),
      endWeek: Number.parseInt(temp[1], 10),
    })
  })
  return arr
}

/**
 * 从服务器获取当前周
 * @param year 当前学年
 * @param term 当前学期
 */
export const getCurWeekFromServer = (year: number, term: Term) =>
  new Promise<number>((resolve, reject) => {
    wtuNoRepeatAjax<any>(
      `http://jwglxt.wtu.edu.cn/cdjy/cdjy_cxQtlb.html?xqh_id=2&xnm=${year}&xqm=${term}&gnmkdm=N2155`
    )
      .then(resp => {
        if (!resp.dqzcxq) {
          reject('查询失败! 请检查当前学期和学年')
        } else {
          if (resp.dqzcxq.DQZC) {
            resolve(Number.parseInt(resp.dqzcxq.DQZC, 10))
          } else {
            reject('查询失败! 请检查当前学期和学年')
          }
        }
      })
      .catch(reject)
  })
