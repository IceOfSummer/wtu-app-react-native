import DatabaseManager from '../index'

export default class MetaDataMapper {
  public static getItem(key: string): Promise<string | null> {
    return new Promise(async resolve => {
      const [result] = await DatabaseManager.executeSqlWithoutLog(
        'SELECT value FROM app_metadata WHERE name = ?',
        [key]
      )
      if (result.rows.length === 0) {
        resolve(null)
      } else {
        resolve(result.rows.item(0).value)
      }
    })
  }

  public static setItem(key: string, value: string) {
    return DatabaseManager.executeSqlWithoutLog(
      'INSERT INTO app_metadata VALUES(?,?) ON CONFLICT(name) DO UPDATE SET value = ?',
      [key, value, value]
    )
  }

  public static removeItem(key: string) {
    return DatabaseManager.executeSqlWithoutLog(
      'DELETE FROM app_metadata WHERE name = ?',
      [key]
    )
  }

  /**
   * 获取数据库版本
   */
  public static async getDBVersion(): Promise<number> {
    const [result] = await DatabaseManager.executeSql(
      'SELECT value FROM app_metadata WHERE name = ?',
      'version'
    )
    return result.rows.item(0).value
  }
}
