//模拟枚举

//检验传入的类型是否在枚举中
function isThisType(val) {
  //相当于闭包，this是指向父类函数
  for (let key in this){
    if(this[key] == val){
      return true
    }
  }
  return false
}

const LoginType = {
  //100代表小程序登陆
  USER_MINI_PROGRAM:100,
  //101代表用email登陆
  USER_EMAIL:101,
  //102是用户手机号的登陆方式
  USER_MOBILE:102,
  //200是管理员的登陆方式
  ADMIN_EMAIL:200,
  isThisType
}

module.exports = {
  LoginType
}