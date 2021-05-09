# i18n-json-generater
---
#### A **CLI tool** to create i18n JSON files from excel(*.xlsx) file.

![](./assets/demo.gif)

### install
```bash
npm i -g i18n-json-generater
```

### usage
After installation, type command `lang xxx`, then follow the prompts. You can also use `npx` instead.
```bash
lang create
lang extract
// or
npx i18n-json-generater create
npx i18n-json-generater extract
```
There are two kinds of command to use:
+ `lang create` Create JSON file for multilingual application.
+ `lang extract` Create XLSX file as translate template file, similar to an inverse operation.

### arguments
#### 1. create (generate JSON file from XLSX file)
+ The first prompt is to get the path of excel file. The Table of the excel file is something like below:

  A|B|C|D|E|F
  --|--|--|--|--|--
  1|key|zh|en|de|more language
  2|name|爆爆|Bob|Bubikopf|...
  3|contact|86 XXX XXXXXXX|44 XXX XXXXXXX|49 XXX XXXXXXX|...
  4|address.country|中国|England|Deutschland|...
  
  You can also get [`lang-template.xlsx`](./lang-template.xlsx) in this repository to see the document format.

+ The secound prompt is to choose the language type you want to create. Up to now, it supports four kind of type based on frequency of use.

  - `zh` is for Chinese, and your excel file should include `zh` column.
  
  - `en` is for English, and your excel file should include `en` column.

  - `de` is for German, and your excel file should include `de` column.

  - `all` is a special type because you can create all language of your table from the excel template file.

+ The finally prompt is a confirm, type Y to continue and after a moment you will get the JSON files in the current directory.
  The JSON files will be automatic generated. Take the chinese file(zh.json) as an example, its content like below:
  ```json
  {
    "name": "爆爆",
    "nationality": "中国",
    "contact": "86 XXX XXXXXXX",
    "address": {
      "country": "中国",
      "city": "上海"
    },
    "hobby": {
      "food": {
        "coke": "可乐",
        "cake": "蛋糕"
      },
      "film": {
        "action": "动作片",
        "magic": "魔幻片"
      }
    },
    "habby": {
      "game": "电脑游戏"
    }
  }
  ```
  You can try to use the `lang-template.xlsx` file in the repository to get the result.
 
  > Now only supports generated files in the current directory

  ##### **Note: you should always set the `key` in the first column, that's very necessary and important.**

#### 2. extract (generate XLSX file from JSON file)
+ The first prompt is to get the path of json file.You can also get [`lang-template.json`](./lang-template.json) in this repository to see the file format.
+ The secound prompt is to input the language abbreviation what translated in your JSON file, such as `zh`,`en`,`de` etc.
  > What you type in this step, will be the table header column for your translation.

+ The finally prompt is a confirm, type Y to continue and after a moment you will get the XLSX file in the current directory.

### remark
Always remember the first row in table is very important. It should include `key` in it. Anothers should be the language abbreviations of what you want to generated, such as `en`, `de`, `jp`, `fr` etc.

### todo
+ It's not support to specify the path of the generated files, I will support it in future.
+ It's more reasonable if the JSON file named `zh-CN.json` istead of `zh.json`. 

### for fun :)