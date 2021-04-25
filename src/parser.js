const XLSX = require('xlsx');
const Constant = require('./constant.js');
const output = require('./output.js');
const { KEY, ALL} = require('./constant.js');

class Parser {
  constructor(opts) {
    this.opts = opts;
    this.initData();
    this.parseKeyIndexMapping();
    this.parseLanguages();
  }

  initData() {
    const { file } = this.opts;
    const workbook = XLSX.readFile(file);
    const first_sheet_name = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[first_sheet_name];
    const sheetArr = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const [titleRow, ...contentRows] = sheetArr;
    if (titleRow.length === 0) {
      output.error('Error: 模板文件内容不能为空 (The content of the template file cannot be empty)');
      process.exit(1);
    }
    this.sheetArr = sheetArr; // 原始SHEET_2_JSON数据
    this.titleRow = titleRow; // 表头
    this.contentRows = contentRows.filter(row => row.length > 0); // 表内容，过滤空数组
    this.indexMapping = {};
    this.translationCache = {};
  }

  parseKeyIndexMapping() {
    const row = this.titleRow;
    for (let i = 0; i < row.length; i++) {
      const key = row[i];
      if (!this.indexMapping.hasOwnProperty(key)) {
        this.indexMapping[key] = i;
      } else {
        output.info(`Warning: 文件表头"${key}"命名重复 (There is a duplicate field "${key}" in the header of the excel file)`);
      }
    }
  }

  parseLanguages() {
    const { langs } = this.opts;
    if (~langs.indexOf(ALL)) { // 单独处理语言"all"的情况
      const l = Object.keys(this.indexMapping).filter(k => k !== KEY);
      this.core(l);
    } else {
      this.core(langs);
    }
  }

  core(langs) {
    const rows = this.contentRows;
    for (let i = 0; i < langs.length; i++) {
      const lang = langs[i];
      const langIndex = this.indexMapping[lang];
      const keyIndex = this.indexMapping[KEY];
      if (typeof langIndex === 'undefined') {
        output.info(`Warning: 文件内没有语言"${lang}" (There is no language "${lang}" in the excel file)`);
        continue;
      }
      if (!this.translationCache[lang]) {
        this.translationCache[lang] = {};
      } else {
        output.info(`Warning: 文件内"${lang}"语言有重复 (Language "${lang}" is duplicated in excel file)`);
      }

      for (let j = 0; j < rows.length; j++) {
        const content = rows[j];
        const keyValue = content[keyIndex];
        const langValue = content[langIndex];
        this.translationCache[lang][keyValue] = langValue;
      }
    }
  }

  getLanguages() {
    const keys = Object.keys(this.translationCache);
    const result = [];
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      result.push({
        lang: k,
        file: `${k}.json`,
        translation: { ...this.translationCache[k] }
      });
    }
    return result;
  }
}

module.exports = Parser;