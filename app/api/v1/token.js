//检验登陆
const Router = require('koa-router')
const {TokenValidator} = require('../../validator/validatorr')
const {ParameterException} = require('../../../core/http-exception')
const {LoginType} = require('../../lib/enum')
const {User} = require('../../models/user')
const {generateToken} = require('../../../core/util')
const {Auth} = require('../../../middlewares/auth')

const router = new Router({
  prefix:'/v1/token'  //路由的前缀
})

router.post('/',async (ctx)=>{
  const v = await new TokenValidator().validate(ctx)
  //坑，v.get('body.type')得到的数据是字符串，因此v.get('body.type')*1转换为数字，再去对比
  let token
  switch (v.get('body.type')*1) {
    case LoginType.USER_EMAIL:
      token = await emailLogin(v.get('body.account'),v.get('body.secret'))
      break;
    case LoginType.USER_MINI_PROGRAM:
      break;
    case LoginType.ADMIN_EMAIL:
      break;
    default:
      throw new ParameterException('没有对应的类型函数处理')
  }
  //校验成功之后，返回token信息给前端
  ctx.body = {
    token
  }
})

//处理登陆逻辑，
async function emailLogin(account,secret){
  const user = await User.vertifyEmailPassword(account,secret)
  //user就是登陆成功后，返回user整个信息
  return token = generateToken(user.id,Auth.USER)//普通用户登陆成功，设置权限scope为8（管理员的scope为16）
}

module.exports = router
