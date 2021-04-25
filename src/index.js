const pkg = require('../package.json');
const { program } = require('commander');
const chalk = require('chalk')
const create = require('./create-lang-file.js');
const extract = require('./extract-json-file.js');
const output = require('../src/output.js');

/*处理异常*/
process.on('uncaughtException', function (e) {
  output.error(e.message);
});

program
  .version(chalk.green(`${pkg.version}`))
  .name(pkg.name)
  .command('create')
  .description('生成语言JSON文件 (create language JSON file)')
  .action(create);
  
program
  .command('extract')
  .description('从JSON文件中抽取信息生成xlsx文件 (create XLSX file by extracting info from JSON file)')
  .action(extract);
  
program
  .parse(process.argv);