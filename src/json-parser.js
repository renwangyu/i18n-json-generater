const fs = require('fs');
const path = require('path');
const output = require('./output.js');
const { recurJson } = require('./utils.js');

class JsonParser {
  constructor(opts) {
    this.opts = opts;
    this.jsonObj = null;
    this.fileName = '';
    this.fileExtName = '';
    this.flattenObj = {};
    this.initData();
    this.flatten();
  }

  initData() {
    const { file } = this.opts;
    const content = fs.readFileSync(file, 'utf8');
    try {
      this.fileName = path.basename(file).split('.').shift();
      this.fileExtName = path.extname(file);
      if (!~this.fileExtName.toLocaleLowerCase().indexOf('json')) {
        output.error(`Error: 不支持扩展名为${this.fileExtName}的文件，只支持.json文件 (Don't support the file that extend name is ${this.fileExtName}, only support .json)`)
        process.exit(1);
      }
      this.jsonObj = JSON.parse(content);
    } catch(e) {
      output.error(e.message);
    }
  }

  flatten() {
    recurJson(this.jsonObj, this.flattenObj);
  }

  getResult() {
    const { fileName, fileExtName, jsonObj, flattenObj, opts: { file } } = this;
    return {
      file,
      fileName,
      fileExtName,
      jsonObj,
      flattenObj
    }
  }

}

module.exports = JsonParser;