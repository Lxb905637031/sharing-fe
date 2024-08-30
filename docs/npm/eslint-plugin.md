---
title: eslint-plugin-sharing
categories:
  - 工程规范
tags:
  - 工程规范
author:
  link: https://github.com/Lxb905637031/sharing-fe-spec
---

# eslint-plugin-sharing

## 安装

除了本包，你需要同时安装 [ESlint](https://eslint.org/)

```shell
$ npm install eslint-plugin-sharing eslint --save-dev
```

## 使用

### 引入插件

```js
// .eslintrc.js
module.exports = {
  plugin: ['eslint-plugin-sharing'],
  rules: {
    'eslint-plugin-sharing/no-secret-info': 'error',
  }
};
```

### 使用 presets

```js
// .eslintrc.js
module.exports = {
  extends: 'plugin:eslint-plugin-sharing/recommended',
}
```