/**
 * 该插件将移除所有的logger.debug方法
 */
module.exports = ({ types: t }) => {
  return {
    visitor: {
      CallExpression(path) {
        const { callee } = path.node
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: 'logger' }) &&
          t.isIdentifier(callee.property, { name: 'debug' })
        ) {
          path.remove()
        }
      },
    },
  }
}
