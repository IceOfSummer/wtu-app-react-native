import { CombinedEventRemind } from '../../api/server/event_remind'
import DatabaseManager from '../index'
import { generateInsertArgument } from '../../utils/SqlUtils'

export type EventRemindSchema = CombinedEventRemind
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
      ]
    )
    return DatabaseManager.executeSql(argument.statement, ...argument.args)
  }
}
