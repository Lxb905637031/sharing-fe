# markdownlint-config-sharing

> 文档规范

支持配置的 [markdownlint 可共享配置](https://www.npmjs.com/package/markdownlint#optionsconfig)

## 安装

需要先安装 [markdownlint](https://www.npmjs.com/package/markdownlint):

```bash
npm install markdownlint-config-sharing markdownlint --save-dev
```

## 使用
在`.markdownlint.json`中继承本包:
```json
{
  "extends": "markdownlint-config-sharing"
}
```