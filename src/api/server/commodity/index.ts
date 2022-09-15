import { EsCommodity } from '../types'
import { serverCancelOldAjax } from '../../request'

export const searchCommodity = (searchContent: string, page = 0) =>
  serverCancelOldAjax<EsCommodity[]>(
    '/commodity/search',
    { s: searchContent, p: page },
    'GET'
  )
