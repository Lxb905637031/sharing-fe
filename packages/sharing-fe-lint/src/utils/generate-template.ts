import path from 'path'
import fs from 'fs-extra'
import _ from 'lodash'
import glob from 'glob'
import ejs from 'ejs'
import {
  STYLELINT_FILE_EXT,
  ESLINT_IGNORE_PATTERN,
  STYLELINT_IGNORE_PATTERN,
  MARKDOWN_LINT_IGNORE_PATTERN
} from './constants'

/**
 * vscode 配置合并
 * @param filename 
 * @param content 
 */
const mergeVSCodeConfig = (filename: string, content: string) => {
  // 无需merge
  if (!fs.existsSync(filename)) return content

  try {
    const targetData = fs.readJSONSync(filename)
    const sourceData = JSON.parse(content)
    return JSON.stringify(
      _.merge(targetData, sourceData, (target, source) => {
        if (Array.isArray(target) && Array.isArray(source)) {
          return [
            ...new Set(source.concat(target))
          ]
        }
      }),
      null,
      2
    )
  } catch {
    return ''
  }
}

/**
 * @param cwd
 * @param data
 * @param vscode
 */
export default (cwd: string, data: Record<string, any>, vscode: boolean) => {
  const templatePath = path.resolve(__dirname, '../config')
  const templates = glob.sync(`${vscode ? '_vscode' : '**'}/*.ejs`, { cwd: templatePath })

  for (const name of templates) {
    const filepath = path.resolve(cwd, name.replace(/\.ejs$/,'').replace(/^_/, ''))
    let content = ejs.render(
      fs.readFileSync(path.resolve(templatePath, name), 'utf-8'),
      {
        eslintIgnores: ESLINT_IGNORE_PATTERN,
        stylelintExt: STYLELINT_FILE_EXT,
        stylelintIgnores: STYLELINT_IGNORE_PATTERN,
        markdownLintIgnores: MARKDOWN_LINT_IGNORE_PATTERN,
        ...data
      }
    )

    // 合并 vscode config
    if (/^_vscode/.test(name)) {
      content = mergeVSCodeConfig(filepath, content)
    }

    // 跳过空文件
    if (!content.trim()) continue

    fs.outputFileSync(filepath, content, 'utf8')
  }
}