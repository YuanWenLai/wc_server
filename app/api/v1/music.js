const Router = require('koa-router')
const router = new Router()
const {PositiveIntegerValidator} = require('../../validator/validator')

//用于检测API跳转权限
const {Auth} = require('../../../middlewares/auth')

//koa的路由，path的参数，可以声明多个中间键的函数，如下，new Auth（）也是一个中间键函数，
//Auth是作为API路由的检测，非法用户，无法继续执行下一个中间键
router.get('/music/:id',new Auth().m, async (ctx,next)=>{
  //需要将ctx这个上下文传到validator
  const v = await new PositiveIntegerValidator().validate(ctx)

  //validator可以帮你转换参数的类型，例如，id得到是字符串,可以解析为整形,不解析的话，在后面加上parse=false
  console.log(typeof v.get('path.id',parse=true))
  //在校验无误时，需返回一个正确信息
  ctx.body = ctx.auth.uid

})

module.exports = router