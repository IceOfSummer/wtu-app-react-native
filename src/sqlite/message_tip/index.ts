import DatabaseManager, { EMPTY_RESULT_SET } from '../index'

export enum TipType {
  TYPE_POST_REPLY,
  TYPE_COMMENT_REPLY,
}

export type MessageTipTable = {
  message_id: number
  last_reply_uid: number
  count: number
  last_reply_time: number
  last_reply_nickname: string
  title: string
  content: string
  type: TipType
}

type TableName = 'message_tip' | 'unread_message_tip'

/**
 * 使用类声明，避免命名空间混乱
 */
export default class MessageTipMapper {
  /**
   * 插入多条消息提醒，若重复则替换
   * @param tips
   * @param tableName 要操作的表名称
   */
  public static async insertMultiTip(
    tips: MessageTipTable[],
    tableName: TableName = 'message_tip'
  ) {
    if (tips.length === 0) {
      return EMPTY_RESULT_SET
    }
    let sql = `INSERT INTO ${tableName}(message_id,last_reply_uid,count,last_reply_time,last_reply_nickname,title,content,type) VALUES`
    const args: Array<string | number> = []
    for (let i = 0; i < tips.length; i++) {
      const item = tips[i]
      sql += '(?,?,?,?,?,?,?,?)'
      if (i < tips.length - 1) {
        sql += ','
      }
      args.push(
        item.message_id,
        item.last_reply_uid,
        item.count,
        item.last_reply_time,
        item.last_reply_nickname,
        item.title,
        item.content,
        item.type
      )
    }
    sql +=
      ' ON CONFLICT(message_id) DO UPDATE SET count = count + excluded.count, last_reply_time = excluded.last_reply_time, last_reply_nickname = excluded.last_reply_nickname, content = excluded.content, last_reply_uid = excluded.last_reply_uid'
    return DatabaseManager.executeSql(sql, ...args)
  }

  /**
   * 查询某条消息的回复数量
   * @param messageId 消息id
   * @param tableName 表名称
   */
  public static async queryReplyCount(
    messageId: number,
    tableName: TableName = 'message_tip'
  ): Promise<number> {
    const [result] = await DatabaseManager.executeSql(
      `SELECT count FROM ${tableName} WHERE message_id = ?`,
      messageId
    )
    const obj = result.rows.item(0)
    return obj ? obj.count : 0
  }

  public static async selectUnreadTip(): Promise<MessageTipTable[]> {
    const [result] = await DatabaseManager.executeSql(
      'SELECT * FROM unread_message_tip'
    )
    return result.rows.raw()
  }

  /**
   * 为某条消息
   * @param messageId 消息id
   * @param addition 在原来的基础上加多少
   * @param table 哪张表
   * @return 返回1表示成功
   */
  public static async updateCount(
    messageId: number,
    addition: number,
    table: TableName = 'message_tip'
  ): Promise<number> {
    const [result] = await DatabaseManager.executeSql(
      `UPDATE ${table} SET count = count + ? WHERE message_id = ?`,
      addition,
      messageId
    )
    return result.rowsAffected
  }

  public static async selectHistoryMessage(page: number, size = 6) {
    const start = size * (page - 1)
    const [result] = await DatabaseManager.executeSql(
      'SELECT * FROM message_tip LIMIT ?,?',
      start,
      size
    )
    return result.rows.raw()
  }
}
