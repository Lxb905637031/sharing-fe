---
home: true
heroText: '😎'
tagline: 前端编码规范工程化
actionText: 立刻进入
actionLink: /coding/html.md

features: 
  - title: 全面的前端生态
    details: 支持前端全部生态，无需关注环境，支持直接使用
  - title: 完善的规范配件
    details: 支持对全部前端配置实现一键接入、一键扫描、一键修复、一键升级
---

## :couch_and_lamp: 配套工具

引入了多个业界流行的 `Linter` 作为规范文档的配套工具，并根据规范内容定制了对应的规则包，包括：

| 规范              | Lint工具            | npm包            |
| -----------------| --------------------|-----------------|
| JavaScript 编码规范<br />TypeScript 编码规范<br />Node 编码规范        | [ESLint](https://eslint.org) | [eslint-config-sharing](https://www.npmjs.com/package/eslint-config-sharing) |
| CSS 编码规范      | [stylelint](https://stylelint.io)   | [stylelint-config-sharing](https://www.npmjs.com/package/stylelint-config-sharing)  |
| GIT 规范      | [commitlint](https://commitlint.js.org/)    | [commitlint-config-sharing](https://www.npmjs.com/package/commitlint-config-sharing)  |
| 文档 规范     | [markdownlint](https://github/DavidAnson)   | [markdownlint-config-sharing](https://www.npmjs.com/package/markdownlint-config-sharing) |
| ESlint 插件     |[ESLint Plugin](https://eslint.org/docs/latest/extend/plugins) | [eslint-plugin-sharing](https://www.npmjs.com/package/eslint-plugin-sharing)  |

[sharing-fe-lint](https://www.npmjs.com/package/sharing-fe-lint) 收敛屏蔽上述依赖和配置细节，提供简单的 `CLI` 和 `Node.js API`,让项目能够一键接入、一键扫描、一键修复、一键升级，并为项目配置 git commit 卡口，降低项目接入规范的成本

## :email: 联系

- **GitHub**: <https://github.com/Lxb905637031/sharing-fe-spec>