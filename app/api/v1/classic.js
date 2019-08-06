const {Flow} = require('@models/flow')
const {Art} = require('@models/art')
const Router = require('koa-router')
const {PositiveIntegerValidator} = require('@validator/validator')
const {NotFound} = require('@core/http-exception')


const router = new Router({
  prefix:'/v1/classic'  //路由的前缀
})

//用于检测API跳转权限
const {Auth} = require('@middlewares/auth')

//获取API的最新一期
router.get('/latest',new Auth().m, async (ctx,next)=>{
  const flow = await Flow.findOne({
    //按照index这个字段来降序
    order:[
      ['index','DESC']
    ]
  })
  const art = await Art.getData(flow.art_id,flow.type)
  let {content,fav_nums,image,pubdate,title,type} = art
  ctx.body = {is_valid:{content,fav_nums,image,pubdate,title,type,index:flow.index}}
})

//获取当前一期的下一期
router.get('/:index/next',new Auth().m,async ctx =>{
  const v = await new PositiveIntegerValidator().validate(ctx,{
    id:'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where:{
      index:index+1
    }
  })
  if(!flow){
    throw new NotFound('没有找到下一期')
  }
  //先得到文章的信息
  const art = await Art.getData(flow.art_id,flow.type)
  ctx.body = art
})

module.exports = router