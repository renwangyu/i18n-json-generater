const questions = [{
  type: 'input',
  name: 'excelFile',
  message: '请输入.xlsx语言模板文件的路径 (please enter the path of the .xlsx language template file)',
}, {
  type: 'checkbox',
  name: 'langs',
  message: '请选择需要处理的语言 (please select the language to be processed)',
  choices: [{
    name: '中文 (zh)',
    value: 'zh'
  }, {
    name: '英文 (en)',
    value: 'en'
  }, {
    name: '德文 (de)',
    value: 'de'
  }, {
    name: '模板文件所有语言 (all language from template file)',
    value: 'all'
  }]
}, {
  type: 'confirm',
  name: 'confirm',
  message: '请确认输入的信息 (please confirm the infomation you entered)'
}];

module.exports = questions;