"use strict";

const path = require("path");

// windows 路径兼容
function formatPath(p) {
  if (p) {
    if (path.sep === "/") {
      return p;
    } else {
      return p.replace(/\\/g, "/");
    }
  }
  return p;
}

module.exports = formatPath;
