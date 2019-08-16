const Router = require('koa-router')
const {Auth} = require('@middlewares/auth')
const {LikeValidator} = require('@validator/validator')
const {Favor} = require('../../models/favor')
const  {success} = require('../../lib/helper')

const router = new Router({
  prefix:'/v1/like'
})

//点赞
router.post('/',new Auth().m , async (ctx,next)=>{

  //因为LikeError是继承PositiveIntegerValidator，因此要改别名id:art_id
  //因为PositiveIntegerValidator,只对id这个字段做正整数校验
  const v = await new LikeValidator().validate(ctx,{
    //改名
    id:'art_id'
  })
  //因为auth校验后，ctx会携带uid，不需要前端传uid，前端直接传uid较危险
  console.log(1)
  await Favor.like(v.get('body.art_id'),v.get('body.type'),ctx.auth.uid)
  success('点赞成功！')
})

//取消点赞
router.post('/cancle',new Auth().m , async (ctx,next)=>{
  const v = await new LikeValidator().validate(ctx,{
    id:'art_id'
  })
  console.log(2)
  //因为auth校验后，ctx会携带uid，不需要前端传uid，前端直接传uid较危险
  await Favor.dislike(v.get('body.art_id'),v.get('body.type'),ctx.auth.uid)
  success("取消点赞成功！")
})

module.exports = router