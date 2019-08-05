const Koa = require('koa')
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')


require('./app/models/classic')
require('./app/models/flow')
/*ss*/
const app = new Koa()

app.use(parser())
app.use(catchError)
InitManager.initCore(app)

app.listen(3000,()=>{
  console.log('server open on 3000!')
})