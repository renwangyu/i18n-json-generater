const pkg = require('../package.json');
const { program } = require('commander');
const chalk = require('chalk')
const create = require('./create-lang-file.js');
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
  .parse(process.argv);