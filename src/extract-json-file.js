const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const ora = require('ora');
const spinner = ora('take a break ☕ \n');
const output = require('./output.js');
const questions = require('./extract-questions.js');
const JsonParser = require('./json-parser.js');
const XlsxGenerater = require('./xlsx-generater.js');

const CWD_PATH = process.cwd();
const CURRENT_PATH = path.resolve(CWD_PATH, './');

function extract(opts) {
  const { file } = opts;
  // 先这样
  const p = path.resolve(CURRENT_PATH, file || './json-template.json')
  if (fs.existsSync(p)) {
    const jp = new JsonParser({ file: p });
    const { file, fileName, fileExtName, flattenObj } = jp;
    const xlsxGenerater = new XlsxGenerater({ file, fileName, fileExtName, data: flattenObj });
    const distFile = path.resolve(CURRENT_PATH, './langs.xlsx');
    xlsxGenerater.translate();
    // xlsxGenerater.deposit(distFile);
  }
}

module.exports = function () {
  inquirer
    .prompt(questions)
    .then(answers => {
      const { jsonFile } = answers;
      extract({ file: jsonFile });

    });
}