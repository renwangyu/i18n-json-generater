const questions = [{
  type: 'input',
  name: 'jsonFile',
  message: '请输入.json语言模板文件的路径 (please enter the path of the .json file)',
}, {
  type: 'input',
  name: 'lang',
  message: '请输入语言简写(zh,en等)作为表头，默认为.josn文件名 (please enter the language shorthand as table header, default to the name of .json file)'
}];

module.exports = questions;