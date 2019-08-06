const Router = require('koa-router')
const {HotBook} = require('@models/hot_book')
const {Book} = require('@models/book')
const {PositiveIntegerValidator,SearchValidator} = require('@validator/validator')
const router = new Router({
  prefix:'/v1/book'
})

router.get('/hot_list',async (ctx,next)=>{
  const books = await HotBook.getAll()
  ctx.body = {books};
})

router.get('/:id/detail',async (ctx,next)=>{
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = new Book()
  ctx.body =await book.detail(v.get('path.id'));
})

router.get('/search', async ctx =>{
  const v = await new SearchValidator().validate(ctx)
  const result = await Book.searchFromYuShu(
    v.get("query.q"),
    v.get("query.start"),
    v.get("query.count")
  );
  ctx.body = result;
})

module.exports = router