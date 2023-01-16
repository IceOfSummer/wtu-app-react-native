import {
  CombinedEventRemind,
  EventRemindType,
} from '../../api/server/event_remind'
import DatabaseManager from '../index'
import { generateInsertArgument } from '../../utils/SqlUtils'

export type EventRemindSchema = CombinedEventRemind

export enum AbstractType {
  /**
   * 点赞
   */
  LIKE,
  /**
   * 回复
   */
  REPLY,
}

function castType(type: EventRemindType): AbstractType {
  switch (type) {
    case EventRemindType.REPLY_SUB:
    case EventRemindType.REPLY_POST:
      return AbstractType.REPLY
    case EventRemindType.LIKE_COMMENT:
    case EventRemindType.LIKE_POST:
      return AbstractType.LIKE
    default:
      throw new Error('未知的提醒类型: ' + type)
  }
}

export default class EventRemindMapper {
  public static readonly TABLE_NAME = 'event_remind'

  public static insertEventReminds(reminds: EventRemindSchema[]) {
    if (reminds.length === 0) {
      return
    }
    const argument = generateInsertArgument(
      EventRemindMapper.TABLE_NAME,
      '',
      reminds,
      entity => [
        entity.id,
        entity.count ?? 1,
        entity.remindTitle,
        entity.sourceId,
        entity.sourceType,
        entity.sourceContent ?? null,
        JSON.stringify(entity.senderIds),
        entity.createTime,
        entity.targetContent,
        castType(entity.sourceType),
      ]
    )
    return DatabaseManager.executeSql(argument.statement, ...argument.args)
  }

  public static async selectEventReminds(
    type: AbstractType,
    page: number = 1,
    size = 5
  ) {
    const [result] = await DatabaseManager.executeSql(
      'SELECT * FROM event_remind WHERE abstractType = ? LIMIT ?,?',
      type,
      (page - 1) * size,
      size
    )
    const arr = result.rows.raw() as EventRemindSchema[]
    arr.forEach(value => {
      value.senderIds = JSON.parse(value.senderIds as unknown as string)
    })
    return arr
  }
}
