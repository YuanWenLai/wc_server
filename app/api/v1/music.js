const Router = require('koa-router')
const router = new Router()
const {ParameterException } = require('../../../core/http-exception')
const {PositiveIntegerValidator} = require('../../validator/validatorr')
router.get('/music/:id', async (ctx,next)=>{
  /*console.log(ctx.path)
  console.log(ctx.request.query)
  console.log(ctx.request.header)
  console.log(ctx.request.body)*/

  //需要将ctx这个上下文传到validator
  const v = await new PositiveIntegerValidator().validate(ctx)

  //validator可以帮你转换参数的类型，例如，id得到是字符串,可以解析为整形,不解析的话，在后面加上parse=false
  console.log(typeof v.get('path.id',parse=true))
  //在校验无误时，需返回一个正确信息
  ctx.body = {
    message:'success'
  }
})

module.exports = router