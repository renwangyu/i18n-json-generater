const fs = require('fs');
const { recur } = require('../utils/tool.js');

class Generater {
  constructor(opts) {
    this.opts = opts;
    this.initData();
  }

  initData() {
    const {
      lang: {
        lang,
        file,
        translation
      } = {}
    } = this.opts;
    this.lang = lang;
    this.file = file;
    this.translationObj = translation;
    this.root = {}; // 今后翻译内容的根对象
  }

  translate() {
    const keys = Object.keys(this.translationObj);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      recur(k, this.translationObj[k], this.root);
    }
  }

  getLang() {
    return this.lang;
  }

  getTranslateResult() {
    return JSON.stringify(this.root, null, 2);
  }

  deposit(dist, opts = {}) {
    if (!dist) {
      return;
    }
    fs.writeFileSync(dist, this.getTranslateResult(), opts);
  }
}

module.exports = Generater;