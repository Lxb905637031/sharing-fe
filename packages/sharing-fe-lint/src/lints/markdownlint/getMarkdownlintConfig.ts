import path from 'path'
import glob from 'glob'
import markdownLint from 'markdownlint'
import markdownLintConfig from 'markdownlint-config-sharing'
import type { ScanOptions, PKG, Config } from '../../types'

type LintOptions = markdownLint.Options & { fix?: boolean }

/**
 * 获取 Markdownlint 配置
 */
export function getMarkdownlintConfig(opts: ScanOptions, config: Config) {
  const { cwd } = opts
  const lintConfig: LintOptions = {
    fix: !!(opts.fix),
    resultVersion: 3
  }

  if (config.markdownlintOptions) {
    // 传入 markdownlintOptions
    Object.assign(lintConfig, config.markdownlintOptions)
  } else {
    const lintConfigFiles = glob.sync('.markdownlint(.@(yaml|yml|json))', { cwd })
    if (lintConfigFiles.length === 0) {
      lintConfig.config = markdownLintConfig
    } else {
      lintConfig.config = markdownLint.readConfigSync(path.resolve(cwd, lintConfigFiles[0]))
    }
  }

  return lintConfig
}