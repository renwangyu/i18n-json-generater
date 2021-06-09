function recur(key, value, obj) {
  if (key.indexOf('.') > 0) { // 有"."的情况
    const arr = key.split('.');
    const firstKey = arr.shift();
    if (!obj[firstKey]) { // 如果当前obj没有，则新建
      obj[firstKey] = {};
    }
    recur(arr.join('.'), value, obj[firstKey]);
  } else {
    obj[key] = value;
  }
}

function recurJson(root, result = {}, preKeyArr = []) {
  const keys = Object.keys(root);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof root[key] === 'object') {
      const arr = [...preKeyArr, key];
      recurJson(root[key], result, arr);
    } else {
      const jk = [...preKeyArr, key].join('.');
      result[jk] = root[key];
    }
  }
}

function getUniqueKey(keyList) {

}

module.exports = {
  recur,
  recurJson
};