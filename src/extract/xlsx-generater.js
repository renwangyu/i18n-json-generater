const XLSX = require('xlsx');
const { KEY } = require('../utils/constant.js');

class XlsxGenerater {
  constructor(opts) {
    this.opts = opts;
    this.initData();
  }

  initData() {
    const { jpList = [], file, fileName, fileExtName, data } = this.opts;
    this.jpList = jpList;
    this.file = file;
    this.fileName = fileName;
    this.fileExtName = fileExtName;
    this.data = data;
    this.excelObj = null;
    const keys = this.jpList.reduce((pre, jp) => {
      const { flattenObj = {} } = jp.getResult();
      return [...pre, ...Object.keys(flattenObj)]
    }, []);
    this.totalUnqiueKeys = Array.from(new Set(keys));
  }

  existFile() {
    return this.jpList.length > 0;
  }

  core() {
    const data = [];
    const header = [KEY];
    let isFirst = true; // 加一个标志位，只在第一轮的时候把fileName塞入header，防止每次key循环再次塞入
    for (let i = 0; i < this.totalUnqiueKeys.length; i++) {
      const uniqueKey = this.totalUnqiueKeys[i];
      const obj = {
        [KEY]: uniqueKey,
      }
      for (let j = 0; j < this.jpList.length; j++) {
        const currJsonParser = this.jpList[j];
        const { fileName, flattenObj } = currJsonParser.getResult();
        obj[fileName] = typeof flattenObj[uniqueKey] !== 'undefined' ? flattenObj[uniqueKey] : '';
        if (isFirst) {
          header.push(fileName);
        }
      }
      data.push(obj);
      isFirst = false;
    }
    console.log(header)
    return { header, data };
  }

  translate() {
    const { header, data } = this.core();
    const workBook = XLSX.utils.book_new(); // 创建一个工作簿
    const workSheet = XLSX.utils.json_to_sheet(data, { header })
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