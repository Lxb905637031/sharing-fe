# sharing-fe-lint

`sharing-fe-lint` 是[前端编码规范工程化]的配套 Lint 工具，可以为项目一键接入规范、一键扫描和修复规范问题，保障项目的编码规范和代码质量。

## 背景

引入了多个业界流行的 Linter，并根据规范内容定制了规则包，它们包括：

| 规范                    | Lint 工具                 | npm包             |
| ---------------------- | -------------------------| -----------------|
| JavaScript 编码规范 <br/> TypeScript 编码规范 <br/> Node 编码规范 | [ESLint](https://eslint.org/)                              | [eslint-config-sharing](https://www.npmjs.com/package/eslint-config-sharing)             |
| CSS 编码规范            | [styleLint](https://stylelint.io/)    |[stylelint-config-sharing](https://www.npmjs.com/package/stylelint-config-sharing)        |
| Git规范                 | [commitlint](https://commitlint.js.org/#/)          | [commitlint-config-sharing](https://www.npmjs.com/package/commitlint-config-sharing)|
文档规范                          | [markdownlint](https://github.com/DavidAnson/markdownlint)  | [markdownlint-config-sharing](https://www.npmjs.com/package/markdownlint-config-sharing)  |

可以看到这些 `Linter` 和规则包众多且零散，全部安装它们会给项目增加十几个依赖，接入和升级成本都比较高。

`sharing-fe-lint` 收敛屏蔽了这些依赖和配置细节，提供简单的 CLI 和 Node.js API，让项目能够一键接入、一键扫描、一键修复、一键升级，并为项目配置 git commit 卡口，降低项目接入规范的成本。

## CLI 使用

### 安装

在终端执行：

```bash
npm install sharing-fe-lint -g
```

安装完成后，可执行`sharing-fe-lint -h`以验证安装成功。

### 使用

#### `sharing-fe-lint init`: 一键接入

在项目根目录执行 `sharing-fe-lint init`，即可一键接入规范，为项目安装规范 `Lint` 所需的依赖和配置。

执行过程包括：

- 安装各种依赖：包括 `Linter` 依赖，如 [ESLint](https://eslint.org/)、[stylelint](https://stylelint.io/)、[commitlint](https://commitlint.js.org/#/)、[markdownlint](https://github.com/DavidAnson/markdownlint) 等；配置依赖，如 [eslint-config-sharing](https://www.npmjs.com/package/eslint-config-sharing)、[stylelint-config-sharing](https://www.npmjs.com/package/stylelint-config-sharing)、[commitlint-config-sharing](https://www.npmjs.com/package/commitlint-config-sharing)、[markdownlint-config-sharing](https://www.npmjs.com/package/markdownlint-config-sharing) 等
- 写入各种配置文件，包括：
  - `.eslintrc.js`、`.eslintignore`: ESLint 配置(继承`eslint-config-sharing`)及黑名单文件
  - `.stylelintrc.js`、`.stylelintignore`: stylelint配置(继承`stylelint-config-sharing`)及黑名单文件
  - `commitlint.config.js`: commitlint配置(继承`commitlint-config-sharing`)
  - `.markdownlint.json`、`.markdownlintignore`: `markdownlint`配置及黑名单文件
  - `.prettierrc.js`: 符合规则的 [Prettier 配置](https://prettier.io/docs/en/configuraion.html)
  - `.editorconfig`: 符合规范的 [editorconfig](https://editorconfig.org/)
  - `.vscode/extensions.json`: 写入规范相关的 [VSCode 插件推荐](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions)，包括 `ESLint`、`stylelint`、`markdownlint`、`prettier` 等
  - `.vscode/settings.json`：写入规范相关的 [VSCode 设置](https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations)，设置 `ESLint` 和 `stylelint` 插件的 `validate` 及**保存时自动运行 fix**，如果选择使用 `Prettier`，会同时将 `prettier-vscode` 插件设置为各前端语言的 defaultFormatter，并配置**保存时自动格式化**
  - `sharing-fe-lint.config.js`sharing-fe-lint 包的一些配置，如启用的功能等
- 配置 git commit 卡口：使用 [husky](https://www.npmjs.com/package/husky) 设置代码提交卡口，在 git commit是会运行`sharing-fe-lint commit-file-scan`和`sharing-fe-lint commit-msg-scan`分别对提交文件和提交信息进行规范检查。`sharing-fe-lint commit-file-scan` 默认仅对 error 问题卡口，如果你想对 warn 问题也卡口，可以增加 `--strict`参数以开启严格模式
  
> notice 1：如果项目已经配置过 ESLint、stylelint等 Linter,执行`sharing-fe-lint init`将会提示存在冲突的依赖和配置，并在得到确认后进行覆盖
>
> notice 2: 如果项目的 .vscode/ 目录被 .gitignore 忽略，可以在拉取项目后单独执行`sharing-fe-lint init --vscode`命令写入`.vscode/extensions.json`和`.vscode/settings.json`配置文件

#### `sharing-fe-lint scan`: 一键扫描

在项目的根目录执行命令，即可扫描项目的规范问题：

支持下列参数：

- `-q` `--quiet` 仅报告 error 级别的问题
- `-o` `--output-report` 输出扫描出的规范问题日志
- `-i` `--include <dirpath>` 指定要进行规范扫描的目录
- `--no-ignore` 忽略 eslint 的 ignore 配置文件和 ignore 规则
  
> notice 1： 事实上，你可以在任意目录执行 `sharing-fe-lint scan``sharing-fe-int` 会根据文件类型、JSON 等特征嗅探项目类型。但还是推荐执行过`sharing-fe-lint init`的项目根目录执行`sharing-fe-lint scan`,以得到最准确的扫描结果。
> notice 2: `sharing-fe-lint` 会根据项目内有无 eslint 和 stylelint 配置文件判断使用项目的配置文件还是 `sharing-fe-lint` 默认配置进行扫描。若使用项目的，在未安装依赖时会帮其安装（执行 npm i）。若使用项目配置扫描失败，则使用默认配置扫描

#### `sharing-fe-lint fix`：一键修复

在项目的根目录执行命令，即可修复部分规范问题：

支持下列参数:

- `-i` `--include <dirpath>` 指定要进行修复扫描的目录
- `--no-ignore`忽略 eslint 的 ignore 配置文件和 ignore 规则
  
注意请 review 下修复前后的代码，以免工具误修的情况。

#### `sharing-fe-lint commit-file-scan` 提交文件扫描

在git commit 时对提交文件进行规范问题扫描，需配合 git 的 pre-commit 钩子使用。

支持下列参数：

- `-s` `--strict` 严格模式, 对 warn 和 error 问题都卡口，默认仅对 error 问题卡口
  
#### `sharing-fe-lint commit-msg-scan` 提交信息扫描

git commit 时对 commit message 的格式进行扫描（使用commitlint），需配合 [husky](https://www.npmjs.com/package/husky)的 commit-msg 钩子使用。

## Node.js API 使用

### 安装

```bash
npm install sharing-fe-lint --save
```

### API

#### init：初始化

- sharing-fe-lint.init(config):将项目一键接入规范，效果等同于`sharing-fe-lint lint`
  
示例：

```js
await sharing-fe-lint.init({
  eslintType: 'react',
  enableESLint: true,
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true,
  disableNpmInstall: false
})
```
config参数如下:
| 参数          |  类型             | 默认值           | 说明              |
|-------------- |------------------|-----------------|-----------------|
| cwd           |string        | -           |项目绝对路径              |
| eslintType    |ESLintType    | -           |语言和框架类型，如果不配置，等同于sharing-fe-lint lint，控制台会出现选择器，如果配置，控制台就不会出现选择器     |
| enableEsLint  | boolean      | true         |是否启用ESLint，如果不匹配默认值为true，即默认启用ESLint   |
| enableStylelint | boolean    | -            |是否启用 stylelint，如果不配置，等同于 sharing-fe-lint init，控制台会出现选择器，如果配置，控制台就不会出现选择器        |
| enableMarkdownlint | boolean  | -         |是否启用 markdownlint，如果不配置，等同于 sharing-fe-lint init，控制台会出现选择器，如果配置，控制台就不会出现选择器   |
| enablePrettier    | boolean  | -          | 是否启用Prettier    |
| disableNpmInstall  | boolean  | false     |是否禁用自动在初始化完成后安装依赖

##### ESLintType

- `default`: JavaScript 项目（未使用 React 和 Vue 的 JS 项目）
- `react`: JavaScript + React 项目
- `vue`: JavaScript + Vue 项目
- `typescript/default`: TypeScript 项目（未使用 React 和 Vue 的 TS 项目）
- `typescript/react`: TypeScript + React 项目
- `typescript/vue`: TypeScript + Vue 项目
- `es5`: ES5 及之前版本的 JavaScript 老项目

## 配置

`sharing-fe-lint` 基于一份配置进行扫描（也可以零配置使用），支持的配置参数有:

| 参数              | 类型      | 默认值      | 说明            |
|------------------|-----------|------------|----------------|
| enableESLint     | boolean  | true        | 是否启用 ESLint   |
| enableStylelint  | boolean  | true        | 是否启用 stylelint |
| enableMarkdownlint | boolean | true       | 是否启用markdownlint |
| enablePrettier    | boolean   | -      | 是否启用Prettier  |
| eslintOptions     | ESLint.Options| -   | ESLint 配置项，若未设置将使用执行目录下或内置的默认 eslintrc 和 eslintignore 进行扫描 |
| stylelintOptions  | stylelint.LinterOptions | -       |stylelint配置项，若未设置将使用执行目录下或内置默认stylelintrc和stylelintigonre进行扫描  |
| markdownlintOptions   | markdownlint.Options | -      | markdownlint配置项，若未设置将使用执行目录下或内置的默认markdownlint配置文件进行扫描

`sharing-fe-lint` 会读取执行目录下的 `sharing-fe-lint.config.js`作为配置文件。`sharing-fe-lint lint`会在执行目录下新增如下的`sharing-fe-lint.config.js`文件：

```JavaScript
module.exports = {
  enableESLint: true,
  enableStylelint: true,
  enableMarkdownlint: true
  enablePrettier: true
}
```

## 常见问题

### TypeScript 项目扫描性能问题

如果 TS 项目 commit 卡口 和 `sharing-fe-lint scan` 运行时间很长，可以通过如下在`.eslintrc.js`中增加以下配置提升性能：

```JavaScript
module.exports = {
  parserOptions: {
    project: []，
    createDefaultProgram: false
  },
  rules: {
    '@typescript-eslint/dot-notation': 0, // for lint performance
    '@typescript-eslint/restrict-plus-operands': 0, // for lint performance
  },
}
```