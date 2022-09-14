import { nonNull } from '../../../utils/ObjectUtils'
import { getInputValue } from '../../../utils/htmlUtils'
import { wtuNoRepeatAjax } from '../../request'

/**
 * 基本查课标识
 */
export interface ClassMark {
  xkkz_id: string
  kklxdm: string
}

/**
 * 课程查询参数, 所有课程通用
 */
export interface BaseQueryParam {
  xqh_id: string
  // jg_id在input中name为jg_id_1
  jg_id: string
  zyh_id: string
  zyfx_id: string
  njdm_id: string
  bh_id: string
  xbm: string
  xslbdm: string
  ccdm: string
  xsbj: string
  xkxnm: string
  xkxqm: string
  xszxzt: string
  availableSelect: Array<SubjectSelectItem>
}

export type SubjectSelectItem = {
  title: string
  key: string
  xkkz_id: string
  kklxdm: string
}

export const getBaseQueryParam = (username: string) =>
  new Promise<BaseQueryParam>((resolve, reject) => {
    wtuNoRepeatAjax<string>(
      `http://jwglxt.wtu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbIndex.html?gnmkdm=N253512&layout=default&su=${username}`
    )
      .then(resp => {
        try {
          const match = resp.match(/<div class="nodata">.+<\/s/)
          if (match != null) {
            reject(
              match[0]
                .replace('<div class="nodata"><span>', '')
                .replace('</s', '')
            )
            return
          }
          const availableItem = resp.match(/queryCourse\(.+/g)
          const items: Array<SubjectSelectItem> = []
          if (availableItem != null) {
            availableItem.forEach(val => {
              const m = val.match(/[0-9|A-Z]{2,}/g)
              console.log(m)
              const nameArr = val.match(/[\u4e00-\u9fa5]+/)
              let title = '获取课程名称失败'
              if (nameArr) {
                title = nameArr[0]
              }
              if (m && m.length !== 0) {
                items.push({
                  kklxdm: m[0],
                  xkkz_id: m[1],
                  title,
                  key: m[1],
                })
              }
            })
          }

          // TODO 查询有待优化!
          resolve({
            jg_id: nonNull(getInputValue(resp, 'jg_id_1')),
            bh_id: nonNull(getInputValue(resp, 'bh_id')),
            xqh_id: nonNull(getInputValue(resp, 'xqh_id')),
            // jg_id在input中name为jg_id_1
            zyh_id: nonNull(getInputValue(resp, 'zyh_id')),
            zyfx_id: nonNull(getInputValue(resp, 'zyfx_id')),
            njdm_id: nonNull(getInputValue(resp, 'njdm_id')),
            xbm: nonNull(getInputValue(resp, 'xbm')),
            xslbdm: nonNull(getInputValue(resp, 'xslbdm')),
            ccdm: nonNull(getInputValue(resp, 'ccdm')),
            xsbj: nonNull(getInputValue(resp, 'xsbj')),
            xkxnm: nonNull(getInputValue(resp, 'xkxnm')),
            xkxqm: nonNull(getInputValue(resp, 'xkxqm')),
            xszxzt: nonNull(getInputValue(resp, 'xszxzt')),
            availableSelect: items,
          })
        } catch (ignore) {
          console.log(ignore)
          reject('加载失败, 请稍后再试')
        }
      })
      .catch(reject)
  })

/**
 * 查询某门课时所用参数
 */
export interface SubjectQueryParam {
  rwlx: string
  xkly: string
  bklx_id: string
  sfkkjyxdxnxq: string
  sfkknj: string
  sfkkzy: string
  kzybkxy: string
  sfznkx: string
  zdkxms: string
  sfkxq: string
  sfkcfx: string
  kkbk: string
  kkbkdj: string
  sfkgbcx: string
  sfrxtgkcxd: string
  tykczgxdcs: string
  rlkz: string
  xkzgbj: string
  rlzlkz: string
  xklc: string
}

export const getSubjectQueryParam = (
  username: string,
  mark: ClassMark,
  baseQueryParam?: BaseQueryParam
) =>
  new Promise<SubjectQueryParam>((resolve, reject) => {
    wtuNoRepeatAjax<string>(
      `http://jwglxt.wtu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbDisplay.html?gnmkdm=N253512&su=${username}`,
      {
        xkkz_id: mark.xkkz_id,
        xszxzt: baseQueryParam?.xszxzt,
        kspage: '0',
        jspage: '0',
      },
      'POST'
    )
      .then(html => {
        try {
          resolve({
            rwlx: nonNull(getInputValue(html, 'rwlx')),
            xkly: nonNull(getInputValue(html, 'xkly')),
            bklx_id: nonNull(getInputValue(html, 'bklx_id')),
            sfkkjyxdxnxq: nonNull(getInputValue(html, 'sfkkjyxdxnxq')),
            sfkknj: nonNull(getInputValue(html, 'sfkknj')),
            sfkkzy: nonNull(getInputValue(html, 'sfkkzy')),
            kzybkxy: nonNull(getInputValue(html, 'kzybkxy')),
            sfznkx: nonNull(getInputValue(html, 'sfznkx')),
            zdkxms: nonNull(getInputValue(html, 'zdkxms')),
            sfkxq: nonNull(getInputValue(html, 'sfkxq')),
            sfkcfx: nonNull(getInputValue(html, 'sfkcfx')),
            kkbk: nonNull(getInputValue(html, 'kkbk')),
            kkbkdj: nonNull(getInputValue(html, 'kkbkdj')),
            sfkgbcx: nonNull(getInputValue(html, 'sfkgbcx')),
            sfrxtgkcxd: nonNull(getInputValue(html, 'sfrxtgkcxd')),
            tykczgxdcs: nonNull(getInputValue(html, 'tykczgxdcs')),
            rlkz: nonNull(getInputValue(html, 'rlkz')),
            xkzgbj: nonNull(getInputValue(html, 'xkzgbj')),
            rlzlkz: nonNull(getInputValue(html, 'rlzlkz')),
            xklc: nonNull(getInputValue(html, 'xklc')),
          })
        } catch (ignore) {
          reject('加载失败, 请稍后重试')
        }
      })
      .catch(reject)
  })

export interface SubjectInfo {
  kcmc: string
  kch_id: string
  xf: string
  cxbj: string
  fxbj: string
  // 已选人数
  yxzrs: number
  jxb_id: string
}

export const getSubjectList = (
  username: string,
  mark: ClassMark,
  subjectQueryParam: SubjectQueryParam,
  baseQueryParam?: BaseQueryParam,
  page = 1
) =>
  new Promise<Array<SubjectInfo>>((resolve, reject) => {
    wtuNoRepeatAjax<any>(
      `http://jwglxt.wtu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbPartDisplay.html?gnmkdm=N253512&su=${username}`,
      {
        'clb_id_list[0]': 95,
        rwlx: subjectQueryParam.rwlx,
        xkly: subjectQueryParam.xkly,
        bklx_id: subjectQueryParam.bklx_id,
        sfkkjyxdxnxq: subjectQueryParam.sfkkjyxdxnxq,
        xqh_id: baseQueryParam?.xqh_id,
        jg_id: baseQueryParam?.jg_id,
        zyh_id: baseQueryParam?.zyh_id,
        zyfx_id: baseQueryParam?.zyfx_id,
        njdm_id: baseQueryParam?.njdm_id,
        bh_id: baseQueryParam?.bh_id,
        xbm: baseQueryParam?.xbm,
        xslbdm: baseQueryParam?.xslbdm,
        ccdm: baseQueryParam?.ccdm,
        xsbj: baseQueryParam?.xsbj,
        sfkknj: subjectQueryParam.sfkknj,
        sfkkzy: subjectQueryParam.sfkkzy,
        kzybkxy: subjectQueryParam.kzybkxy,
        sfznkx: subjectQueryParam.sfznkx,
        zdkxms: subjectQueryParam.zdkxms,
        sfkxq: subjectQueryParam.sfkxq,
        sfkcfx: subjectQueryParam.sfkcfx,
        kkbk: subjectQueryParam.kkbk,
        kkbkdj: subjectQueryParam.kkbkdj,
        sfkgbcx: subjectQueryParam.sfkgbcx,
        sfrxtgkcxd: subjectQueryParam.sfrxtgkcxd,
        tykczgxdcs: subjectQueryParam.tykczgxdcs,
        xkxnm: baseQueryParam?.xkxnm,
        xkxqm: baseQueryParam?.xkxqm,
        kklxdm: mark.kklxdm,
        rlkz: subjectQueryParam.rlkz,
        xkzgbj: subjectQueryParam.xkzgbj,
        kspage: 15 * (page - 1) + 1,
        jspage: 15 * page,
        jxbzb: '',
      },
      'POST'
    ).then(resp => {
      if (!resp.tmpList || !Array.isArray(resp.tmpList)) {
        reject('加载失败, 请稍后重试')
        return
      }
      const arr: Array<SubjectInfo> = []
      const tmpList = resp.tmpList as Array<any>
      tmpList.forEach(value => {
        arr.push({
          kcmc: value.jxbmc,
          kch_id: value.kch_id,
          xf: value.xf,
          cxbj: value.cxbj,
          fxbj: value.fxbj,
          // 已选人数
          yxzrs: Number.parseInt(value.yxzrs, 10),
          jxb_id: value.jxb_id,
        })
      })
      resolve(arr)
    })
  })

export interface SubjectDetail {
  /**
   * 最大人数, data.jxbrl
   */
  maxCount: number
  /**
   * 上课时间, data.sksj
   */
  time: string
  /**
   * 授课老师 data.jsxx
   */
  teacher: string
  /**
   * 原始数据
   */
  origin: {
    do_jxb_id: string
  }
}

export const getSubjectDetail = (
  username: string,
  mark: ClassMark,
  info: SubjectInfo,
  subjectQueryParam?: SubjectQueryParam,
  baseQueryParam?: BaseQueryParam
) =>
  new Promise<SubjectDetail>((resolve, reject) => {
    wtuNoRepeatAjax<any>(
      `http://jwglxt.wtu.edu.cn/xsxk/zzxkyzbjk_cxJxbWithKchZzxkYzb.html?gnmkdm=N253512&su=${username}`,
      {
        rwlx: subjectQueryParam?.rwlx,
        xkly: subjectQueryParam?.xkly,
        bklx_id: subjectQueryParam?.bklx_id,
        sfkkjyxdxnxq: subjectQueryParam?.sfkkjyxdxnxq,
        xqh_id: baseQueryParam?.xqh_id,
        jg_id: baseQueryParam?.jg_id,
        zyh_id: baseQueryParam?.zyh_id,
        zyfx_id: baseQueryParam?.zyfx_id,
        njdm_id: baseQueryParam?.njdm_id,
        bh_id: baseQueryParam?.bh_id,
        xbm: baseQueryParam?.xbm,
        xslbdm: baseQueryParam?.xslbdm,
        ccdm: baseQueryParam?.ccdm,
        xsbj: baseQueryParam?.xsbj,
        sfkknj: subjectQueryParam?.sfkknj,
        sfkkzy: subjectQueryParam?.sfkkzy,
        kzybkxy: subjectQueryParam?.kzybkxy,
        sfznkx: subjectQueryParam?.sfznkx,
        zdkxms: subjectQueryParam?.zdkxms,
        sfkxq: subjectQueryParam?.sfkxq,
        sfkcfx: subjectQueryParam?.sfkcfx,
        kkbk: subjectQueryParam?.kkbk,
        kkbkdj: subjectQueryParam?.kkbkdj,
        xkxnm: baseQueryParam?.xkxnm,
        xkxqm: baseQueryParam?.xkxqm,
        rlkz: subjectQueryParam?.rlkz,
        kklxdm: mark.kklxdm,
        kch_id: info.kch_id,
        xkkz_id: mark.xkkz_id,
        cxbj: info.cxbj,
        fxbj: info.fxbj,
      },
      'POST'
    )
      .then(resp => {
        if (!Array.isArray(resp)) {
          reject('加载失败, 请稍后再试')
          return
        }
        let target: any
        resp.forEach(value => {
          if (value.jxb_id === info.jxb_id) {
            target = value
            return
          }
        })
        if (!target) {
          target = resp[0]
        }
        resolve({
          maxCount: Number.parseInt(nonNull(target.jxbrl), 10),
          time: nonNull(target.sksj).replace('<br/>', '\n'),
          teacher: nonNull(target.jsxx),
          origin: {
            do_jxb_id: nonNull(target.do_jxb_id),
          },
        })
      })
      .catch(reject)
  })

/**
 *
 * @param username
 * @param jxb_ids 查看课程详细时提供
 * @param mark
 * @param baseQueryParam
 * @param queryParam
 * @param info
 */
export const selectSubject = (
  username: string,
  jxb_ids: string,
  mark: ClassMark,
  info: SubjectInfo,
  queryParam?: SubjectQueryParam,
  baseQueryParam?: BaseQueryParam
) =>
  new Promise<void>((resolve, reject) => {
    wtuNoRepeatAjax<any>(
      `http://jwglxt.wtu.edu.cn/xsxk/zzxkyzbjk_xkBcZyZzxkYzb.html?gnmkdm=N253512&su=${username}`,
      {
        jxb_ids,
        kch_id: info.kch_id,
        kcmc: info.kcmc,
        rwlx: queryParam?.rwlx,
        rlkz: queryParam?.rlkz,
        rlzlkz: queryParam?.rlzlkz,
        sxbj: queryParam?.rlkz || queryParam?.rlzlkz ? '1' : '0',
        // xxkbj: 是否有先行课
        xxkbj: 0,
        // qz: 权重
        qz: 0,
        // cxbj: 是否重修
        cxbj: 0,
        xkkz_id: mark.xkkz_id,
        njdm_id: baseQueryParam?.njdm_id,
        zyh_id: baseQueryParam?.zyh_id,
        kklxdm: mark.kklxdm,
        xklc: queryParam?.xklc,
        xkxnm: baseQueryParam?.xkxnm,
        xkxqm: baseQueryParam?.xkxqm,
      },
      'POST'
    )
      .then(resp => {
        if (!resp.flag) {
          reject(resp.msg ? resp.msg : '选课失败, 请稍后重试')
          return
        }
        if (Number.parseInt(resp.flag, 10) === 1) {
          resolve()
        } else {
          reject(resp.msg)
        }
      })
      .catch(reject)
  })
