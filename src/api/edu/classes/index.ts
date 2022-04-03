import { noRepeatAjax } from 'axios-simple-wrapper'
import { ClassInfo, Term } from '../../../redux/reducers/lessonsTable'

export const getLessons = (
  username: string,
  year: number,
  term: 3 | 12
): Promise<Array<ClassInfo>> =>
  new Promise((resolve, reject) => {
    noRepeatAjax<object>(
      `http://jwglxt.wtu.edu.cn/kbcx/xskbcx_cxXsKb.html?gnmkdm=N2151&su=${username}`,
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

          const weekDuration = value.zcd.toString().replace('周').split('-')
          const startWeek = Number.parseInt(weekDuration[0], 10)
          const endWeek = Number.parseInt(weekDuration[1], 10)

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
            startWeek,
            endWeek,
            teacher,
            contains,
            examType,
            lessonsType,
          })
        })
        resolve(arr)
      })
      .catch(reject)
  })

/**
 * 从服务器获取当前周
 * @param year 当前学年
 * @param term 当前学期
 */
export const getCurWeekFromServer = (year: number, term: Term) =>
  new Promise<number>((resolve, reject) => {
    noRepeatAjax<any>(
      `http://jwglxt.wtu.edu.cn/cdjy/cdjy_cxQtlb.html?xqh_id=2&xnm=${year}&xqm=${term}&gnmkdm=N2155`
    )
      .then(resp => {
        if (!resp.dqzcxq) {
          reject('查询失败! 请检查当前学期和学年')
        } else {
          if (resp.dqzcxq.DQZC) {
            resolve(resp.dqzcxq.DQZC)
          } else {
            reject('查询失败! 请检查当前学期和学年')
          }
        }
      })
      .catch(reject)
  })
