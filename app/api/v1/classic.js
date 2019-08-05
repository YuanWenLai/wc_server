const {Flow} = require('../../models/flow')
const {Art} = require('../../models/art')
const Router = require('koa-router')
const router = new Router({
  prefix:'/v1/classic'  //路由的前缀
})

//用于检测API跳转权限
const {Auth} = require('../../../middlewares/auth')

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
  ctx.body = {content,fav_nums,image,pubdate,title,type,index:flow.index}
})

module.exports = router