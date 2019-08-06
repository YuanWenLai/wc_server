//简单调用success就可以返回成功信息
const { Success } = require('../../core/http-exception');

function success(msg, errCode) {
  throw new Success(msg, errCode);
}

module.exports = {
  success,
}