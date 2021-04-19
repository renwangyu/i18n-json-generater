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

module.exports = {
  recur
};