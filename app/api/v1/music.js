const Router = require('koa-router')
const {HotMusicList} = require('@models/hot_music_list')
const {RecommendMusic} = require('@models/recommend_music')
const {Music} = require('@models/classic')
const {PositiveIntegerValidator} = require('../../validator/validator')

const router = new Router({
  prefix:'/v1/music'  //路由的前缀
})
//用于检测API跳转权限
const {Auth} = require('../../../middlewares/auth')


//获取热门歌单
router.get('/getHotList',async ctx=>{
  ctx.body = await HotMusicList.getHotMusicList()
})

//获取推荐歌单
router.get('/recommendMusic',async ctx=>{
  ctx.body = await RecommendMusic.getRecommendMusic()
})

//获取一个系列的歌单专辑
router.get('/musicList/:type',new Auth().m,async ctx=>{
  const v = await new PositiveIntegerValidator().validate(ctx,{id:"type"})
  ctx.body = await Music.getMusicList(v.get('path.type'))
})

//获取单曲详情
router.get('/music/:id',new Auth().m, async (ctx,next)=>{
  const v = await new PositiveIntegerValidator().validate(ctx)
  ctx.body = await Music.getMusicDetail(v.get('path.id'))
})

module.exports = router