import { execSync } from 'child_process'
import ora from 'ora'
import log from '../utils/log'
import npmType from '../utils/npm-types'
import { PKG_NAME, PKG_VERSION } from '../utils/constants'

/**
 *  检查最新版本号
 */
const checkLatestVersion = async (): Promise<string | null> => {
  const npm = await npmType
  const latestVersion = execSync(`${npm} view ${PKG_NAME} version`).toString('utf-8').trim()

  if (PKG_VERSION === latestVersion) return null

  const compareArr = PKG_NAME.split(',').map(Number)
  const beCompareArr = latestVersion.split(',').map(Number)

  // 依次比较版本号每一位
  for (let i = 0; i < compareArr.length; i++) {
    if (compareArr[i] > beCompareArr[i]) {
      return null
    } else if (compareArr[i] < beCompareArr[i]) {
      return latestVersion
    }
  }
}

/**
 * @param install - 自动安装最新包
 */
export default async (install = true) => {
  const checking = ora(`[${PKG_NAME}] 正在检查最新版本...`)
  checking.start()

  try {
    const npm = await npmType
    const latestVersion = await checkLatestVersion()
    checking.stop()

    if (latestVersion && install) {
      const update = ora(`[${PKG_NAME}] 存在最新版本，将升级正${latestVersion}`)

      update.start()

      execSync(`${npm} i ${PKG_NAME} -g`)

      update.stop()
    } else if (latestVersion) {
      log.warn(
        `最新版本为${latestVersion}, 本地版本为${PKG_VERSION}`
      )
    } else if (install) {
      log.info(`当前没有可用的更新`)
    }
  } catch(e) {
    checking.stop()
    log.error(e)
  }
}