const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const ora = require('ora');
const spinner = ora('take a break ☕ \n');
const output = require('./output.js');
const { ALL, ALLOW_EXT } = require('./constant.js');
const Parser = require('./parser.js');
const Generater = require('./generater.js');
const questions = require('./create-questions.js');

const CWD_PATH = process.cwd();
const CURRENT_PATH = path.resolve(CWD_PATH, './');

function create(opts) {
  const { file, langs } = opts;
  const parser = new Parser({ file, langs });
  const languages = parser.getLanguages();
  const files = [];
  for (let i = 0; i < languages.length; i++) {
    const generater = new Generater({ lang: languages[i] });
    files.push(generater);
  }
  return write(files);
}

function write(files) {
  if (files.length === 0) {
    output.info('Info: 没文件可以写入 (Nothing to write)');
    return false;
  }
  try {
    const dir = path.resolve(CURRENT_PATH, './lang');
    if (!fs.existsSync(dir)) { // 当前路径如果没有再新建lang目录
      fs.mkdirSync(dir);
    }
    for (let i = 0; i < files.length; i++) {
      const generater = files[i];
      generater.translate();
      const f = path.resolve(dir, `./${generater.getLang()}.json`)
      generater.deposit(f);
    }
    return true;
  } catch(e) {
    return false;
  }
}

module.exports = function () {
  inquirer
    .prompt(questions)
    .then(answers => {
      let { excelFile, confirm, langs, ...rest } = answers;
      if (!confirm) {
        output.error('Error: 请重新确认 (please confirm again)');
        process.exit(1);
      }
      const excel = path.resolve(CURRENT_PATH, excelFile);
      const ext = path.extname(excel);
      const REG_EXT = new RegExp(`(${ALLOW_EXT.join('|')})$`, 'ig');
      if (!REG_EXT.test(ext)) {
        output.error(`Error: 模板文件类型不正确，只支持后缀名${ALLOW_EXT.join('、')}的文件 (The template file type is incorrect, only files with the extension ${ALLOW_EXT.join('、')} are supported)`);
        process.exit(1);
      }
      if (!fs.existsSync(excel)) {
        output.error('Error: 语言模板文件不存在，请重新输入 (The language template file does not exist, please enter again)');
        process.exit(1);
      }

      if (langs.length === 0 || ~langs.indexOf(ALL)) { // 如果语言选了"all"，就剔除其他语言选项
        langs = [ALL];
      }
      spinner.start();
      const flag = create({ file: excel, langs, ...rest });
      if (flag) {
        spinner.succeed(`🍺 ${langs.join('、')}语言JSON文件创建成功 (success to create language JSON files)`);
      } else {
        spinner.fail('😖 创建失败请重试 (failed, please try again)')
      }
    });
};