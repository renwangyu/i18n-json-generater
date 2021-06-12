const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const ora = require('ora');
const spinner = ora('take a break ☕ \n');
const output = require('../utils/output.js');
const questions = require('../question/extract-questions.js');
const { JSON_ALLOW_EXT } = require('../utils/constant.js');
const JsonParser = require('./json-parser.js');
const XlsxGenerater = require('./xlsx-generater.js');

const CWD_PATH = process.cwd();
const CURRENT_PATH = path.resolve(CWD_PATH, './');

// ./zh.json;./en.json,./de.json
function extract(opts) {
  const { files = [] } = opts;
  const jpList = [];
  for (let i = 0; i < files.length; i++) {
    const p = path.resolve(CURRENT_PATH, files[i]);
    if (fs.existsSync(p)) {
      const jp = new JsonParser({ file: p });
      jpList.push(jp);
    }
  }
  const xlsxGenerater = new XlsxGenerater({ jpList });
  return write(xlsxGenerater);
}

function write(generater) {
  if (typeof generater === 'undefined' || !generater.existFile()) {
    output.info('Info: 没文件可以写入 (Nothing to write)');
    return false;
  }
  try {
    const distFile = path.resolve(CURRENT_PATH, './translation.xlsx');
    generater.translate();
    generater.deposit(distFile)
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
      const { jsonFiles, lang, confirm, ...rest } = answers;
      if (!confirm) {
        output.error('Error: 请重新确认 (please confirm again)');
        process.exit(1);
      }
      const jsonFileArr = jsonFiles.split(/;|,/g);
      jsonFileArr.forEach(jsonFile => {
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
      })
      spinner.start();
      const flag = extract({ files: jsonFileArr, lang, ...rest });
      // const flag = extract({ file: jsonFile, lang, ...rest });
      if (flag) {
        spinner.succeed(`🍺 翻译XLSX文件创建成功 (success to create translation XLSX files)`);
      } else {
        spinner.fail('😖 创建失败请重试 (failed, please try again)')
      }
    });
}