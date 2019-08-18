const axios = require('axios')
const util = require('util')
const wx = require('../../config/config').wx
const {AuthFailed} = require('../../core/http-exception')
const {User} = require('../models/user')
const {generateToken} = require('../../core/util')
const {Auth} = require('../../middlewares/auth')

class WXManger {
  constructor(){

  }
  static async codeToken(code){
    console.log(code)
    const url = util.format(
      wx.loginUrl,
      wx.appId,
      wx.appSecret,
      code
    )
    //向微信发送请求
    const result = await axios.get(url)
    //console.log(result.data)
    if(result.status !== 200){
      throw new AuthFailed('openid获取失败')
    }
    if (result.data.errcode){//登陆成功是不存在errcode和errmsg
      throw new AuthFailed('登陆不合法：'+result.data.errmsg)
    }
    //先查询是否存在openid，有则不添加
    let user =await User.getUserByOpenid(result.data.openid)
    //console.log(result.data.openid)
    //console.log(user)
    //如果用户不存在，新增用户
    if (!user){
      user = await User.registerByOpenid(result.data.openid)
    }
    return generateToken(user.id,Auth.USER)
  }
}

module.exports = {
  WXManger
}