import { serverCancelOldAjax } from '../../index'
import { EsCommodity } from '../types'

export const searchCommodity = (searchContent: string, page = 0) =>
  serverCancelOldAjax<EsCommodity[]>(
    '/commodity/search',
    { s: searchContent, p: page },
    'GET'
  )
