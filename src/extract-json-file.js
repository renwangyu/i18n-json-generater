const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const ora = require('ora');
const spinner = ora('take a break ☕ \n');
const output = require('./output.js');
const questions = require('./extract-questions.js');
const { JSON_ALLOW_EXT } = require('./constant.js');
const JsonParser = require('./json-parser.js');
const XlsxGenerater = require('./xlsx-generater.js');

const CWD_PATH = process.cwd();
const CURRENT_PATH = path.resolve(CWD_PATH, './');

function extract(opts) {
  const files = [];
  const { file, lang } = opts;
  const p = path.resolve(CURRENT_PATH, file)
  if (fs.existsSync(p)) {
    const jp = new JsonParser({ file: p, lang });
    const { file, fileName, fileExtName, flattenObj } = jp;
    const xlsxGenerater = new XlsxGenerater({ file, fileName, fileExtName, data: flattenObj });
    files.push(xlsxGenerater);
  }
  return write(files);
}

function write(files) {
  if (files.length === 0) {
    output.info('Info: 没文件可以写入 (Nothing to write)');
    return false;
  }
  try {
    const distFile = path.resolve(CURRENT_PATH, './translation.xlsx');
    for (let i = 0; i < files.length; i++) {
      const xlsxGenerater = files[i];
      xlsxGenerater.translate();
      xlsxGenerater.deposit(distFile);
    }
    return true;
  } catch(e) {
    output.error(e.message);
    return false;
  }
}

module.exports = function () {
  inquirer
    .prompt(questions)
    .then(answers => {
      const { jsonFile, lang, ...rest } = answers;
      const json = path.resolve(CURRENT_PATH, jsonFile);
      const ext = path.extname(json);
      const REG_EXT = new RegExp(`(${JSON_ALLOW_EXT.join('|')})$`, 'ig');
      if (!REG_EXT.test(ext)) {
        output.error(`Error: JSON文件类型不正确，只支持后缀名${JSON_ALLOW_EXT.join('、')}的文件 (The .json file type is incorrect, only files with the extension ${JSON_ALLOW_EXT.join('、')} are supported)`);
        process.exit(1);
      }
      if (!fs.existsSync(json)) {
        output.error('Error: JSON文件不存在，请重新输入 (The .json file does not exist, please enter again)');
        process.exit(1);
      }

      spinner.start();
      const flag = extract({ file: jsonFile, lang, ...rest });
      if (flag) {
        spinner.succeed(`🍺 翻译XLSX文件创建成功 (success to create translation XLSX files)`);
      } else {
        spinner.fail('😖 创建失败请重试 (failed, please try again)')
      }
    });
}