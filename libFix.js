/**
 * 由于某些库存在一些问题，需要直接修改源码来修复。
 * 为避免手动操作出错，使用nodejs直接操作文件进行修改，在打包前直接调用该文件即可
 *
 * <b>不要重复调用!</b>
 */
const fs = require('fs')
function rawBottomSheetLibFix() {
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

rawBottomSheetLibFix()
