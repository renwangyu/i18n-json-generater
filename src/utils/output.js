const chalk = require('chalk');

function success(txt) {
  console.log(chalk.bgGreen.black(txt));
}

function error(txt) {
  console.log(chalk.bgRed.black(txt));
}

function info(txt) {
  console.log(chalk.bgYellow.black(txt));
}

module.exports = {
  success,
  error,
  info
};