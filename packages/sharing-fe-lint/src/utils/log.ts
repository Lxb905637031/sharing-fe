import chalk from 'chalk'
import { PKG_NAME, UNICODE } from './constants'

const { green, blue, yellow, red } = chalk

export default {
  success(text: string) {
    console.log(green(text))
  },
  info(text: string) {
    console.log(blue(text))
  },
  warn(text: string) {
    console.log(yellow(text))
  },
  error(text: string) {
    console.log(red(text))
  },
  result(text: string, pass: boolean) {
    console.log(
        blue(`[${PKG_NAME}]${text}`,
        pass ? green(UNICODE.success) : red(UNICODE.failure)
      )
    )
  }
}
