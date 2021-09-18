#! /usr/bin/env node

const importLocal = require("import-local");

if (importLocal(__filename)) {
  // 主要是为了方便调试线上版本 如果全局node_modules安装了leex-cli-dev那么这个分支就会生效
  require("npmlog").info("cli", "正在使用 imooc-li 本地版本");
} else {
  require("../lib/index.js")(process.argv.slice(2));
}
