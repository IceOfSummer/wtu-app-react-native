type InsertArgument = {
  statement: string
  args: Arg[]
}

type Arg = string | number | null | undefined

/**
 * 生成sql插入语句
 * @param tableName 表名
 * @param template 模板，该值将附件在表名后，例如: `(id,name,score)`
 * @param entities 实体数组
 * @param processor 由某个实体生成sql参数
 */
export const generateInsertArgument = <T>(
  tableName: string,
  template: string,
  entities: T[],
  processor: (entity: T) => Arg[]
): InsertArgument => {
  let sql = `INSERT INTO ${tableName}${template} `
  const values = generateInsertValues(entities, processor)
  return {
    statement: sql + values.sql,
    args: values.args,
  }
}

export const generateInsertValues = <T>(
  entities: T[],
  processor: (entity: T) => Arg[]
) => {
  let sql = 'VALUES'
  const args: Arg[] = []
  for (let i = 0, len = entities.length; i < len; i++) {
    const arg = processor(entities[i])
    sql += '('
    for (let j = 0, len2 = arg.length; j < len2; j++) {
      sql += '?'
      if (j < len2 - 1) {
        sql += ','
      }
    }
    sql += ')'
    if (i < len - 1) {
      sql += ','
    }
    args.push(...arg)
  }
  return {
    sql,
    args,
  }
}
