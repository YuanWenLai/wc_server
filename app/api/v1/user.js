const Router = require('koa-router')
const {RegisterValidator} = require('../../validator/validatorr')

const {User} = require('../../models/user')
const router = new Router({
  prefix:'/v1/user'  //路由的前缀
})


router.post('/register',async (ctx)=>{
  const v = await new RegisterValidator().validate(ctx)

  const user = {
    email:v.get('body.email'),
    password:v.get('body.password1'),
    nickname:v.get('body.nickname')
  }
  User.create(user)
  ctx.body='success'
})

module.exports = router