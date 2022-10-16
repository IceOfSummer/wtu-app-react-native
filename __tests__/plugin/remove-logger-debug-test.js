const babel = require('@babel/core')
const plugin = require('../../plugin/remove-logger-debug.js')

const example = `
const logger = getLogger('/redux/counter/messageSlice')

const test = () => {
logger.debug('')
logger.info()
logger.debug()
}
`

it('works', () => {
  const { code } = babel.transform(example, {
    plugins: [plugin],
    presets: [],
    filename: '',
  })
  expect(code).toMatchSnapshot()
})
