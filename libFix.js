/**
 * 由于某些库存在一些问题，需要直接修改源码来修复。
 * 为避免手动操作出错，使用nodejs直接操作文件进行修改，在打包前直接调用该文件即可
 *
 * <b>不要重复调用!</b>
 */
const fs = require('fs')

/**
 * 修复react-native-raw-bottom-sheet的model无法覆盖导航栏
 */
function rawBottomSheetLibFix() {
  console.log('=========rawBottomSheetLibFix=========')
  console.log('fix: react-native-raw-bottom-sheet status bar translucent')
  const content = '        statusBarTranslucent'
  const rnRawBottomSheetPath =
    './node_modules/react-native-raw-bottom-sheet/src/index.js'
  const data = fs
    .readFileSync(rnRawBottomSheetPath, 'utf8')
    .split(/\r\n|\n|\r/gm)
  if (data[108] === content) {
    console.log('fix cancel: react-native-raw-bottom-sheet has already fixed')
    return
  }
  data.splice(108, 0, content)

  fs.writeFileSync(rnRawBottomSheetPath, data.join('\r\n'))
  console.log('done: react-native-raw-bottom-sheet status bar translucent')
}

/**
 * 修复ViewPropTypes被废弃, 代码会<b>先插入后删除</b>
 * @param path {string} 文件路径
 * @param targetLine {number} 最大检测深度, 如前面10行都是导入其它库，那么可以将该参数设置为10或者更大，过大的值可能会造成错误
 * @param insertAt {number} 在哪一行插入依赖
 */
function fixViewPropTypesDeprecated(path, targetLine, insertAt) {
  console.log('=========fixViewPropTypesDeprecated=========')
  console.log('fix: deprecated prop ViewPropTypes')
  console.log('fixing:' + path)
  const targetText = 'ViewPropTypes'
  const insertStr =
    // eslint-disable-next-line quotes
    "import { ViewPropTypes } from 'deprecated-react-native-prop-types';"
  const data = fs.readFileSync(path, 'utf8').split(/\r\n|\n|\r/gm)
  if (data[targetLine].includes(targetText)) {
    data.splice(insertAt, 0, insertStr)
    data.splice(targetLine, 1)
    fs.writeFileSync(path, data.join('\r\n'))
    console.log(`fix done: ${path}`)
    return
  }
  console.log(`fix error: ${path} has already fixed`)
}

rawBottomSheetLibFix()
fixViewPropTypesDeprecated(
  './node_modules/react-native-button/Button.js',
  9,
  11
)
