//用于权限的检验，判断用户身份有权限访问指定的API
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const {Forbbiden} = require('../core/http-exception')
const security = require('../config/config').security

class Auth {
  constructor(level){
    //访问API时，传入一个level，作为API的等级
    this.level = level || 1
    //定义类的变量，不是属性，直接用Auth.
    Auth.USER = 8 //普通用户的权限
    Auth.ADMIN = 16 //管理员的权限
    Auth.SUPER_ADMIN = 32 //超级管理员的权限 ， 作为以后项目的扩展
  }

  get m(){
    return async (ctx,next)=>{
      const userToken = basicAuth(ctx.req)
      //得到userToken，检验userToken是否存在,(userToken对象中有name和pass)
      if(!userToken || !userToken.name){
        //检验抛出错误
        throw new Forbbiden('无token，无法访问')
      }
      //如果存在token，则检验token的合法性
      try {
        //jwt的verify,检验token的合法
        //参数token，和秘钥secretKey('cavin')
        //decode是加密token时的对象信息
        var decode = jwt.verify(userToken.name,security.secretKey)
      }catch (e) {
        //jwt校验得到错误1.token不合法，或2.token过期
        if(e.name === 'TokenExpiresEorror'){
          throw new Forbbiden('token已过期')
        }
        throw new Forbbiden('token不合法，无法访问')
      }
      if(decode.scope < this.level){
        //用户权限小于API等级
        throw new Forbbiden('权限不够')
      }
      //验证成功后，返回给前端uid，scope，方便前端多次调用，jwt是可以传数据的
      ctx.auth = {
        uid:decode.uid,
        scope:decode.scope
      }
      //成功验证后，调用下一个中间键
      await next()
    }
  }
}

module.exports = {Auth}