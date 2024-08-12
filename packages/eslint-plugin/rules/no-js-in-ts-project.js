const path = require('path')

const RULE_NAME = 'no-js-in-ts-project'

const JS_REG = /\.jsx?$/

const DEFAULE_WHITE_LIST = [
  'commitlint.config.js',
  'eslintrc.js',
  'prettierrc.js',
  'stylelintrc.js'
]

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    fixable: null,
    messages: {
      noJSInTSProject: 'The "{{fileName}}" is not recommended in TS project'
    }
  },
  create(context) {
    const fileName = context.getFilename()
    const extName = path.extname(fileName)
    const ruleOptions = context.options[0] || {}
    let {
      whileList = [],
      autoMerge = true
    } = ruleOptions

    // 处理白名单
    if (whileList.length === 0) {
      whileList = DEFAULE_WHITE_LIST
    } else if (autoMerge) {
      whileList = [...new Set([...DEFAULE_WHITE_LIST, ...whileList])]
    }

    const whileListReg = new RegExp(`${whileList.join('|')}$`)

    if (
      !whileListReg.test(fileName) &&
      JS_REG.test(extName)
    ) {
      context.report({
        loc: {
          start: {
            line: 0,
            column: 0
          },
          end: {
            line: 0,
            column: 0
          }
        },
        messageId: 'noJSInTSProject',
        data: {
          fileName
        }
      })
    }
  }
}