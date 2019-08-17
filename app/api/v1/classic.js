const {Flow} = require('@models/flow')
const {Art} = require('@models/art')
const {Favor} = require('@models/favor')
const Router = require('koa-router')
const {PositiveIntegerValidator,ClassValidator} = require('@validator/validator')
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
  const favor = await Favor.userLikeit(flow.art_id,flow.type,ctx.auth.uid)
  art.setDataValue('index',flow.index)
  art.setDataValue('like_status',favor)
  ctx.body = art
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
  const favor = await Favor.userLikeit(flow.art_id,flow.type,ctx.auth.uid)
  art.setDataValue('index',flow.index)
  art.setDataValue('like_status',favor)
  ctx.body = art
})

//获取当前一期的上一期
router.get('/:index/prev',new Auth().m,async ctx =>{
  const v = await new PositiveIntegerValidator().validate(ctx,{
    id:'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where:{
      index:index-1
    }
  })
  if(!flow){
    throw new NotFound('没有找到上一期')
  }
  //先得到文章的信息
  const art = await Art.getData(flow.art_id,flow.type)
  const favor = await Favor.userLikeit(flow.art_id,flow.type,ctx.auth.uid)
  art.setDataValue('index',flow.index)
  art.setDataValue('like_status',favor)
  ctx.body = art
})

//获取某一期详细信息
router.get('/:type/:id',new Auth().m,async ctx =>{
  const v = await new ClassValidator().validate(ctx)
  const art_id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const art = await Art.getData(art_id,type)
  const favor = await Favor.userLikeit(art_id,type,ctx.auth.uid)
  if(!art){
    throw new NotFound()
  }
  art.setDataValue('like_status',favor)
  ctx.body = art
})

//获取点赞信息
router.get('/:type/:id/favor',new Auth().m,async ctx=>{
  const v = await new ClassValidator().validate(ctx)
  //url的id经过validator的isInt校验，自动转换为整形
  const id = v.get('path.id')
  //需要将url的参数转为整形
  const type = parseInt(v.get('path.type'))
  const art =await Art.getData(id,type)
  const favor =await Favor.userLikeit(id,type,ctx.auth.uid)
  if(!art){
    throw new NotFound('期刊不存在！')
  }
  ctx.body = {
    fav_nums: art.fav_nums,
    like_status:favor
  }
})

//获取用户收藏的期刊
router.get('/favor',new Auth().m , async ctx =>{
  ctx.body =await Favor.getMyClassFavor(ctx.auth.uid)
})

module.exports = router