'use strict';

// anws 是 CLI 工具，此文件为 package main 入口占位
// 使用方式见 README.md：npm install -g anws && anws init
module.exports = {
  init: require('./init'),
  update: require('./update'),
};
