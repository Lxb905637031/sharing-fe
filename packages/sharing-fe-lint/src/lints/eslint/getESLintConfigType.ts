import glob from 'glob'
import type { PKG } from '../../types'

/**
 * 获取 ESLint配置类型
 *  eslint-config-sharing/typescript/react
 *  eslint-config-sharing/typescript/vue
 *  eslint-config-sharing/react
 *  eslint-config-sharing/vue
 * 
 * @param cwd 
 * @param pkg 
 */
export function getESLintConfigType(cwd: string, pkg: PKG): string {
  const tsFiles = glob.sync('./!(node_modules)/**/*.@(ts|tsx)', { cwd })
  const reactFiles = glob.sync('./!(node_modules)/**/*.@(jsx|tsx)',{ cwd })
  const vueFiles = glob.sync('./!(node_modules)/**/*.vue', { cwd })
  const dependencies = Object.keys(pkg.dependencies || {})
  const language = tsFiles.length > 0 ? 'typescript' : ''
  let dsl = ''

  if (reactFiles.length > 0 || dependencies.some((name) => /^react(-|$)/.test(name))) {
    dsl = 'react'
  } else if (vueFiles.length > 0 || dependencies.some((name => /^vue(-|$)/.test(name)))) {
    dsl = 'vue'
  } else if (dependencies.some((name) => /^rax(-|$)/.test(name))) {
    dsl = 'rax'
  }

  return (
    'eslint-config-sharing/' + `${language}/${dsl}`.replace(/\/$/, '/index').replace(/^\//, '')
  )
}