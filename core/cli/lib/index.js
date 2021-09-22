"use strict";

module.exports = core;

// require支持 .js .json .node 文件
// .js -> module.exports exports
// .json -> JSON.parse
// .node -> c++ JS addon
// 其他也可以 .txt 通过js引擎来执行 只要文件里面的代码可以用js引擎解析
const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const userHome = require("user-home");
const pathExists = require("path-exists").sync;
const log = require("@leex-cli-dev/log");

const constant = require("./const");
const pkg = require("../package.json");

let args;

async function core(argv) {
  try {
    console.log("exec core:", argv);
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    checkEnv();
    await checkGlobalUpdate();
  } catch (e) {
    log.error(e.message);
  }
}

async function checkGlobalUpdate() {
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  const { getNpmSemversion } = require("@leex-cli-dev/get-npm-info");
  const lastVersion = await getNpmSemversion(currentVersion, npmName);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(`请更新 ${npmName}, 更新命令: npm install -g ${npmName}`));
  }
}

// 检查环境变量
function checkEnv() {
  const dotenv = require("dotenv");
  const dotenvPath = path.resolve(userHome, ".env");
  if (pathExists(dotenvPath)) {
    const env = dotenv.config({ path: dotenvPath });
    console.log(env);
  }
  createDefaultConfig();
  log.verbose("环境变量", process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  const cliConfig = { home: userHome };
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

// 检查输入参数
function checkInputArgs() {
  const minimist = require("minimist");
  args = minimist(process.argv.slice(2));
  checkArgs();
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  log.level = process.env.LOG_LEVEL;
}

// 检查主目录
function checkUserHome() {
  console.log(userHome);
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("登录用户主目录不存在！"));
  }
}

function checkRoot() {
  const rootCheck = require("root-check"); // 系统权限降级
  rootCheck();
}

function checkNodeVersion() {
  // 获取最低版本号
  const currentVersion = process.version;
  const lowestVersion = constant.LOWEST_NODE_VERIOSN;
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`leex-cli 需要依赖 v${lowestVersion} 以上的Node.js版本`)
    );
  }
}

function checkPkgVersion() {
  log.notice("cli", pkg.version);
}
