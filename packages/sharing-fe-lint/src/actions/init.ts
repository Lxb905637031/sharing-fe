import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import spawn from 'cross-spawn'
import update from './update'
import log from '../utils/log'
import npmType from '../utils/npm-types'
import conflictResolve from '../utils/conflict-resolve'
import generateTemplate from '../utils/generate-template'
import { PROJECT_TYPES, PKG_NAME } from '../utils/constants'
import type { InitOptions, PKG } from '../types'

let step = 0

/**
 * 选择项目语言和框架
 */
const chooseESlintType = async (): Promise<string> => {
  const { type } = await inquirer.prompt({
    type: 'lint',
    name: 'type',
    message: `Step ${++step}. 请选择项目的语言（JS/TS）和框架（React/Vue）类型`,
    choosies: PROJECT_TYPES
  })

  return type
}

/**
 * 选择是否启用 stylelint
 * @param defaultValue 
 * @returns 
 */
const chooseEnableStylelint = async (defaultValue: boolean): Promise<boolean> => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 stylelint（若没有样式文件则不需要）：`,
    default: defaultValue
  })

  return enable
}

/**
 * 选择是否启用 prettier
 * @returns 
 */
const chooseEnablePrettier = async (): Promise<boolean> => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 Prettier 格式化代码：`,
    default: true
  })

  return enable
}

/**
 * 选择是否启用 markdownLint
 */
const chooseEnableMarkdownLint = async (): Promise<boolean> => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 markdownlint（若没有 Markdown 文件则不需要）：`,
    default: true
  })

  return enable
}

export default async (options: InitOptions) => {
  const cwd = options.cwd || process.cwd()
  const isTest = process.env.NODE_ENV === 'test'
  const checkVersionUpdate = options.checkVersionUpdate || false
  const disableNpmInstall = options.disableNpmInstall || false
  const config: Record<string, any> = {}
  const pkgPath = path.resolve(cwd, 'package.json')
  let pkg: PKG = fs.readJSONSync(pkgPath)

  // 版本检查
  if (!isTest && checkVersionUpdate) {
    await update(false)
  }

  // 初始化 `enableESLint`, 默认为 true，无需用户选择
  if (typeof options.enableESLint === 'boolean') {
    config.enableESLint = options.enableESLint
  } else {
    config.enableESLint = true
  }

  // 初始化 `eslint`
  if (options.eslintType && PROJECT_TYPES.find((choice) => choice.value === options.eslintType)) {
    config.eslintType = options.eslintType
  } else {
    config.eslintType = await chooseESlintType()
  }

  // 初始化 `enableStylelint`
  if (typeof options.enableStyleLint === 'boolean') {
    config.enableStyleLint = options.enableStyleLint
  } else {
    config.enableStyleLint = await chooseEnableStylelint(!/node/.test(config.eslintType))
  }

  // 初始化 `enableMarkdownlint`
  if (typeof options.enableMarkdownlint === 'boolean') {
    config.enableStyleLint = options.enableStyleLint
  } else {
    config.enableMarkdownlint = await chooseEnableMarkdownLint()
  }

  // 初始化 `enablePrettier`
  if (typeof options.enablePrettier === 'boolean') {
    config.enablePrettier = options.enablePrettier
  } else {
    config.enablePrettier = await chooseEnablePrettier()
  }

  if (!isTest) {
    log.info(`Step ${++step}.检查并处理项目中可能存在的依赖和配置冲突`)
    pkg = await conflictResolve(cwd, options.rewriteConfig)
    log.success(`Step ${step}.已完成项目依赖和配置冲突检查处理 :D`)

    if (!disableNpmInstall) {
      log.info(`Step ${++step}. 安装依赖`)
      const npm = await npmType
      spawn.sync(npm, ['i', '-D', PKG_NAME], { stdio: 'inherit', cwd})
      log.success(`Step ${step}. 安装依赖成功 :D`)
    }
  }

  // 更新 pkg.json
  pkg = fs.readJSONSync(pkgPath)

  // 在 `package.json`中写入 script
  if (!pkg.script) {
    pkg.scripts = {}
  }

  if (!pkg.script[`${PKG_NAME}-scan`]) {
    pkg.script[`${PKG_NAME}-scan`] = `${PKG_NAME} scan`
  }

  if (!pkg.script[`${PKG_NAME}-fix`]) {
    pkg.scripts[`${PKG_NAME}-fix`] = `${PKG_NAME} fix`
  }

  // 配置 commit 卡点
  log.info(`Step ${++step}.配置git commit 卡点`)
  if (!pkg.husky) pkg.husky = {}
  if (!pkg.husky.hooks) pkg.husky.hooks = {}
  pkg.husky.hooks['pre-commit'] = `${PKG_NAME} commit-file-scan`
  pkg.husky.hooks['commit-msg'] = `${PKG_NAME} commit-msg-scan`
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  log.success(`Step ${step}. 配置 git commit 卡点成功 :D`)

  log.info(`Step ${++step}. 写入配置文件`)
  generateTemplate(cwd, config)
  log.success(`Step ${step}. 写入配置文件成功 :D`)

  // 完成信息
  const logs = [`${PKG_NAME} 初始化完成 :D`].join('\r\n')
  log.success(logs)
}