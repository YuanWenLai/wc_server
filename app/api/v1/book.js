const Router = require('koa-router')
const {HotBook} = require('@models/hot_book')
const {Book} = require('@models/book')
const {Favor} = require('@models/favor')
const {Comment} = require('@models/book-comments')
const {success} = require('../../lib/helper')
const {
  PositiveIntegerValidator,
  SearchValidator,
  AddShortCommentValidator
} = require('@validator/validator')

//用于检测API跳转权限
const {Auth} = require('@middlewares/auth')

const router = new Router({
  prefix:'/v1/book'
})

const book = new Book()

//获取热门书籍
router.get('/hot_list',async (ctx,next)=>{
  const books = await HotBook.getAll()
  ctx.body = books;
})

//获取书籍详细信息
router.get('/:id/detail',async (ctx,next)=>{
  const v = await new PositiveIntegerValidator().validate(ctx)
  ctx.body =await book.detail(v.get('path.id'));
})

//书籍搜索
router.get('/search', async ctx =>{
  const v = await new SearchValidator().validate(ctx)
  const result = await Book.searchFromYuShu(
    v.get("query.q"),
    v.get("query.start"),
    //v.get("query.count")
  );
  ctx.body = result;
})

//获取喜欢书籍的数量
router.get('/favor/count',new Auth().m ,async ctx =>{
  const count = await Book.getMyFavorCount(ctx.auth.uid)
  ctx.body = count
})

//获取书籍点赞信息
router.get('/:book_id/favor',new Auth().m ,async ctx =>{
  const v = await new PositiveIntegerValidator().validate(ctx,{
    id:'book_id'
  })
  const id = v.get('path.book_id')
  const likeStatus = await Favor.bookFavor(ctx.auth.uid,id)
  ctx.body = likeStatus
})

//新增短评
router.post('/add/short_comment',new Auth().m ,async ctx =>{
  const v = await new AddShortCommentValidator().validate(ctx,{
    id:'book_id'
  })
  await Comment.addComment(v.get('body.book_id'),v.get('body.content'))
  success()
})

//获取短评信息
router.get('/:book_id/short_comment',new Auth().m ,async ctx =>{
  const v = await new PositiveIntegerValidator().validate(ctx,{
    id:'book_id'
  })
  const ret = await Comment.getComments(v.get('path.book_id'))
  ctx.body = ret
})

//获取热搜关键字
router.get('/hot_keyword',async ctx=>{
  ctx.body = {
    'hot':[
      'Python',
      '东野圭吾',
      '白夜行',
      '韩寒',
      '金庸',
      '王小波',
      '百年孤独',
      '边城'
    ]
  }
})

module.exports = router