const path = require('path');
const fs = require('fs');
const { JSON_ALLOW_EXT } = require('./constant.js');

function recur(key, value, obj) {
  if (key.indexOf('.') > 0) { // 有"."的情况
    const arr = key.split('.');
    const firstKey = arr.shift();
    if (!obj[firstKey]) { // 如果当前obj没有，则新建
      obj[firstKey] = {};
    }
    recur(arr.join('.'), value, obj[firstKey]);
  } else {
    obj[key] = value;
  }
}

function recurJson(root, result = {}, preKeyArr = []) {
  const keys = Object.keys(root);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof root[key] === 'object') {
      const arr = [...preKeyArr, key];
      recurJson(root[key], result, arr);
    } else {
      const jk = [...preKeyArr, key].join('.');
      result[jk] = root[key];
    }
  }
}

function getDepth0JsonFilesInDir(dir) {
  const dirInfo = fs.readdirSync(dir);
  const result = [];
  for (let i = 0; i < dirInfo.length; i++) {
    const item = dirInfo[i];
    const p = path.resolve(dir, item);
    console.log(path.join(dir, item))
    const info = fs.statSync(p);
    if (info.isFile()) {
      const ext = path.extname(p);
      const REG_EXT = new RegExp(`(${JSON_ALLOW_EXT.join('|')})$`, 'ig');
      if (REG_EXT.test(ext)) {
        result.push(p);
      }
    }
  }
  return result;
}

module.exports = {
  recur,
  recurJson,
  getDepth0JsonFilesInDir
};