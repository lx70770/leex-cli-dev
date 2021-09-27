"use strict";

module.exports = init;

function init(projectName, cmdObj) {
  console.log(projectName, cmdObj.force, process.env.TAGET_PATH);
}
