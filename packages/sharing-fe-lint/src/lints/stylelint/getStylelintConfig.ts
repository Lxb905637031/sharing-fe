import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import { LinterOptions } from 'stylelint'
import type { Config, PKG, ScanOptions } from '../../types'
import { STYLELINT_IGNORE_PATTERN } from '../../utils/constants' 

/**
 * 获取 Stylelint 配置
 */
export function getStylelintConfig(opts: ScanOptions, pkg: PKG, config: Config): LinterOptions {
  const { cwd, fix } = opts
  if (config.enableStylelint === false) return {} as any

  const lintConfig: any = {
    fix: !!fix,
    allowEmptyInput: true
  }

  if (config.stylelintOptions) {
    // 传入stylelintOptions
    Object.assign(lintConfig, config.stylelintOptions)
  } else {
    // 根据扫描目录下有无lintrc文件
    const lintConfigFiles = glob.sync('.stylelintrc?.(@(js|yaml|yml|json))', { cwd })
    if (lintConfigFiles.length === 0 && !pkg.stylelint) {
      lintConfig.config = {
        extends: 'stylelint-config-sharing'
      }
    }

    // 根据扫描目录下有无lintignore文件
    const ignoreFilePath = path.resolve(cwd, '.stylelintignore')
    if (!fs.existsSync(ignoreFilePath)) {
      lintConfig.ignoreFilePath = STYLELINT_IGNORE_PATTERN
    }
  }
  
  return lintConfig
}