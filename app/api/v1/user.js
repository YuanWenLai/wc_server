const Router = require('koa-router')
const {RegisterValidator} = require('../../validator/validatorr')

const router = new Router({
  prefix:'/v1/user'  //路由的前缀
})


router.post('/register',async (ctx)=>{
  const v = new RegisterValidator().validate(ctx)
  ctx.body='success'
})

module.exports = router