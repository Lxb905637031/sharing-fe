import path from 'path'
import fs from 'fs-extra'
import glob from 'glob'
import inquirer from 'inquirer'
import log from '../utils/log'
import { PKG_NAME } from './constants'
import type { PKG } from '../types'

//  精确移除依赖
const packageNamesToRemove = [
  '@babel/eslint-parser',
  '@commitlint/cli',
  '@iceworks/spec',
  'babel-eslint',
  'eslint',
  'husky',
  'markdownlint',
  'prettier',
  'stylelint',
  'tslint'
]

// 按前缀移除依赖
const packagePrefixesToRemove = [
  '@commitlint/',
  '@typescript-eslint/',
  'eslint-',
  'stylelint-',
  'markdownlint-',
  'commitlint-'
]

/**
 * 待删除的无用配置
 * @param cwd 
 */
const checkUnlessConfig = (cwd: string): string[] => {
  return []
    .concat(glob.sync(`.eslintrc?(.@(yaml|yml|json))`, { cwd }))
    .concat(glob.sync(`.stylelint?(.@(yaml|yml|json))`, { cwd }))
    .concat(glob.sync(`.markdownlint@(rc|.@(yaml|yml|json))`, { cwd }))
    .concat(
      glob.sync('.prettierrc?(.@(cjs|config.js|config.cjs|yaml|yml|json|json5|toml))', { cwd }),
    )
    .concat(glob.sync('tslint.@(yaml|yml|json)', { cwd }))
    .concat(glob.sync('.kylerc?(.@(yaml|yml|json))', { cwd }))
}

/**
 * 待重写的配置
 * @param cwd 
 */
const checkReWriteConfig = (cwd: string) => {
  return glob
        .sync('**/*.ejs', { cwd: path.resolve(__dirname, '../config') })
        .map((name) => name.replace(/^_/, '.').replace(/\.ejs$/, ''))
        .filter((filename) => fs.existsSync(path.resolve(cwd, filename)))
}

export default async (cwd: string, iswriteConfig?: boolean) => {
  const pkgName = path.resolve(cwd, 'package.json')
  const pkg: PKG = fs.readFileSync(pkgName)
  const dependencies = [].concat(
    Object.keys(pkg.dependencies || {}),
    Object.keys(pkg.devDependencies || {})
  )
  const willRemovePackage = dependencies.filter(
    (name) => 
      packageNamesToRemove.includes(name) ||
      packagePrefixesToRemove.some((prefix) => name.startWith(prefix))
  )
  const uselessConfig = checkUnlessConfig(cwd)
  const reWriteConfig = checkReWriteConfig(cwd)
  const willChangeCount = willRemovePackage.length + uselessConfig.length + reWriteConfig.length

  // 提示是否移除原配置
  if (willChangeCount > 0) {
    log.warn(`检测到项目中存在可能与 ${PKG_NAME} 冲突的依赖和配置，为保证正常运行将`)

    if (willRemovePackage.length > 0) {
      log.warn('删除以下依赖:')
      log.warn(JSON.stringify(willRemovePackage, null, 2))
    }

    if (uselessConfig.length > 0) {
      log.warn('删除以下配置文件:')
      log.warn(JSON.stringify(uselessConfig, null, 2))
    }

    if (reWriteConfig.length > 0) {
      log.warn('覆盖以下配置文件:')
      log.warn(JSON.stringify(reWriteConfig, null, 2))
    }

    if (typeof iswriteConfig === 'undefined') {
      const { isOverWrite } = await inquirer.prompt({
        type: 'confirm',
        name: 'isOverWrite',
        message: '请确认是否继续'
      })

      if (!isOverWrite) process.exit(0)
    } else if (!iswriteConfig) {
      process.exit(0)
    }
  }

  // 删除配置文件
  for (const name of uselessConfig) {
    fs.removeSync(path.resolve(cwd, name))
  }

  // 更改 package.json
  delete pkg.eslintConfig
  delete pkg.eslintIgnore
  delete pkg.stylelint

  for (const name of willRemovePackage) {
    delete (pkg.dependencies || {})[name]
    delete (pkg.devDependencies || {})[name]
  }
  fs.writeFileSync(path.resolve(cwd, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8')

  return pkg
}