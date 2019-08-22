const Router = require('koa-router')
const {RegisterValidator} = require('../../validator/validator')
const {Success} = require('../../../core/http-exception')

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
  await User.create(user)
  //抛出成功的信息
  throw new Success()
})

module.exports = router