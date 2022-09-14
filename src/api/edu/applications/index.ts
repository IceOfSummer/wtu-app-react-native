import { UserInfo } from '../../../redux/reducers/user'
import { Term } from '../../../redux/types/lessonsTableTypes'
import { wtuNoRepeatAjax } from '../../request'
/**
 * 获取用户信息
 */

export const getUserInfo = () =>
  new Promise<UserInfo>((resolve, reject) => {
    wtuNoRepeatAjax<string>(
      'http://jwglxt.wtu.edu.cn/xsxxxggl/xsgrxxwh_cxXsgrxx.html?gnmkdm=N100801&layout=default'
    )
      .then(resp => {
        const splitValue = (str: string) =>
          str.replace('<p class="form-control-static">', '').replace('</p>', '')

        const reg = /<p class="form-control-static">.*<\/p>/g
        const values = resp.match(reg)
        if (!values || values.length === 0) {
          // 请求失败, 登录凭据失效
          reject('登陆过期1')
        }

        // values已经不可能为null了
        const userInfo: UserInfo = {
          name: splitValue(values![1]),
          enrollmentDate: splitValue(values![10]),
        }
        resolve(userInfo)
      })
      .catch(e => {
        reject(e)
      })
  })

export type SubjectScore = {
  subjectName: string
  score: number
  /**
   * 课程类型
   */
  type: string
  teacherName: string
  origin: {
    /**
     * 课程唯一id
     */
    jxb_id: string
    /**
     * 课程名称
     */
    kcmc: string
    /**
     * 成绩, 可用于比较大小
     */
    bfzcj: number
    /**
     * 学年
     */
    xnm: number
    /**
     * 学期
     */
    xqm: Term
    /**
     * 学分
     */
    xf: string
    /**
     * 绩点
     */
    jd: string
    /**
     * 成绩是否作废
     */
    cjsfzf: string
    /**
     * 开课学院
     */
    kkbmmc: string
    /**
     * 成绩性质
     */
    ksxz: string
    /**
     * 是否学位课程
     */
    sfxwkc: string
    /**
     * 教学班
     */
    jxbmc: string
    /**
     * 考核方式
     */
    khfsmc: string
  }
}

export const queryStudentScore = (id: string, year: number, term: Term) =>
  new Promise<Array<SubjectScore>>((resolve, reject) => {
    wtuNoRepeatAjax<any>(
      `http://jwglxt.wtu.edu.cn/cjcx/cjcx_cxDgXscj.html?doType=query&gnmkdm=N305005&su=${id}`,
      {
        xnm: year,
        xqm: term,
        _search: false,
        nd: Date.now(),
        'queryModel.showCount': 15,
        'queryModel.currentPage': 1,
        'queryModel.sortName': '',
        'queryModel.sortOrder': 'asc',
        time: 1,
      },
      'POST'
    )
      .then(resp => {
        if (resp.items && Array.isArray(resp.items)) {
          const arr: Array<SubjectScore> = []
          const targetArr = resp.items as Array<any>
          targetArr.forEach(item => {
            arr.push({
              subjectName: item.kcmc,
              score: item.cj,
              type: item.kcxzmc,
              teacherName: item.jsxm,
              origin: {
                kcmc: item.kcmc,
                jxb_id: item.jxb_id,
                bfzcj: Number.parseInt(item.bfzcj, 10),
                xnm: Number.parseInt(item.xnm, 10),
                xqm: Number.parseInt(item.xqm, 10) === 3 ? 3 : 12,
                jd: item.jd,
                cjsfzf: item.cjsfzf,
                jxbmc: item.jxbmc,
                khfsmc: item.khfsmc,
                kkbmmc: item.kkbmmc,
                ksxz: item.ksxz,
                xf: item.xf,
                sfxwkc: item.sfxwkc,
              },
            })
          })
          resolve(arr)
        } else {
          reject('查询失败, 请稍后再试')
        }
      })
      .catch(reject)
  })

export type ScoreDetails = Array<Score>

type Score = {
  /**
   * 成绩分项名称
   */
  typeName: string
  /**
   * 比例
   */
  rate: string
  /**
   * 成绩
   */
  score: string
}

export const getScoreDetail = (
  username: string,
  jxb_id: string,
  year: number,
  term: Term,
  subjectName: string
) =>
  new Promise<ScoreDetails>((resolve, reject) => {
    wtuNoRepeatAjax<string>(
      `http://jwglxt.wtu.edu.cn/cjcx/cjcx_cxCjxqGjh.html?time=${Date.now()}&gnmkdm=N305005&su=${username}`,
      {
        jxb_id,
        xnm: year,
        xqm: term,
        kcmc: subjectName,
      },
      'POST'
    )
      .then(resp => {
        try {
          // 分离成绩表格
          const scoreList = resp.match(/<tbody>[\s\S]*<\/tbody>/)
          if (!scoreList) {
            reject('请求失败, 请稍后再试')
            return
          }
          // 每三个一组, 第一个是分数的类型, 第二个是分数占比, 第三个是具体分数
          const data = scoreList[0].match(/>.+</g)!
          let currentIndex = 0
          const arr: Array<Score> = []
          const len = data.length

          for (let i = 0; i < len / 3; i++) {
            const scoreDetail: Score = {
              typeName: '',
              rate: '',
              score: '',
            }
            scoreDetail.typeName = data[currentIndex++]
              .replace('>【', '')
              .replace('】<', '')
              .trim()
            scoreDetail.rate = data[currentIndex++]
              .replace('&nbsp;<', '')
              .replace('>', '')
            scoreDetail.score = data[currentIndex++]
              .replace('&nbsp;<', '')
              .replace('>', '')
            arr.push(scoreDetail)
          }
          resolve(arr)
        } catch (e) {
          reject('请求失败, 请稍后再试')
        }
      })
      .catch(reject)
  })
