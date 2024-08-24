import { ESLint } from 'eslint'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import type { Config, PKG, ScanOptions } from '../../types'
import { ESLINT_FILE_EXT } from '../../utils/constants'
import { getESLintConfigType } from './getESLintConfigType'

/**
 *  获取 ESLint 配置
 */
export function getESLintConfig(opts: ScanOptions, pkg: PKG, config: Config) {
  const { cwd, fix, ignore } = opts
  const lintConfig: ESLint.Options = {
    cwd,
    fix,
    ignore,
    extensions: ESLINT_FILE_EXT,
    errorOnUnmatchedPattern: false
  }

  if (config.eslintOptions) {
    // 传入了 eslintOptions
    Object.assign(lintConfig, config.eslintOptions)
  } else {
    // 根据扫描目录下有无lintrc文件，若无则使用默认的 lint配置
    const lintConfigFiles = glob.sync('.eslintrc?(.@(js|yaml|yml|json))', { cwd })
    if (lintConfigFiles.length === 0 && !pkg.eslintConfig) {
      lintConfig.resolvePluginsRelativeTo = path.resolve(__dirname, '../../')
      lintConfig.useEslintrc = false
      lintConfig.baseConfig = {
        extends: [
          getESLintConfigType(cwd, pkg),
          ...(config.enablePrettier ? ['prettier'] : [])
        ]
      }
    }

    // 根据扫描目录下有无lintignore文件，若无则使用默认的ignore 配置
    const lintIgoreFile = path.resolve(cwd, '.eslintignore')
    if (!fs.existsSync(lintIgoreFile) && !pkg.eslintIgnore) {
      lintConfig.ignorePath = path.resolve(__dirname, '../config/_eslintignore.ejs')
    }
  }

  return lintConfig
}