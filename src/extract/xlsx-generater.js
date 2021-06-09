const fs = require('fs');
const XLSX = require('xlsx');
const output = require('../utils/output.js');
const { KEY } = require('../utils/constant.js');

class XlsxGenerater {
  constructor(opts) {
    this.opts = opts;
    this.initData();
  }

  initData() {
    const { file, fileName, fileExtName, data } = this.opts;
    this.file = file;
    this.fileName = fileName;
    this.fileExtName = fileExtName;
    this.data = data;
    this.excelObj = null;
  }

  translate() {
    const workBook = XLSX.utils.book_new(); // 创建一个工作簿
    const keys = Object.keys(this.data);
    const arr = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      arr.push({
        [KEY]: key,
        [this.fileName]: this.data[key]
      })
    }
    const workSheet = XLSX.utils.json_to_sheet(arr, { header: [KEY, this.fileName] })
    XLSX.utils.book_append_sheet(workBook, workSheet, 'lang');// 向工作簿追加一个工作表
    this.excelObj = {
      workBook,
      workSheet
    }
  }

  deposit(dist, opts = {}) {
    if (!dist) {
      return;
    }
    const { workBook } = this.excelObj;
    XLSX.writeFile(workBook, dist);
  }
}

module.exports = XlsxGenerater;